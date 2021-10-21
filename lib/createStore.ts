/**
 * NOTE: this is taken from `buy` project for the sake of the POC. Simplified (no state sanitize, no sentry)
 */
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore,
  Middleware,
  PreloadedState,
  ReducersMapObject,
  Store,
} from "redux";
import { createLogger } from "redux-logger";
import {
  combineEpics,
  createEpicMiddleware,
  EpicMiddleware,
} from "redux-observable";
import { BehaviorSubject, Observable } from "rxjs";

import { extractMultipleEffects } from "./createEffect";
import { mergeMap, take, timeout } from "rxjs/operators";
import { Context, createWrapper } from "next-redux-wrapper";
import { AppState } from "./appState.model";
import { bookReducer } from "./book/book.reducer";
import { BookEffect } from "./book/book.effect";
import { GetServerSidePropsResult } from "next";

const DEBUG_REDUX_QUERY_PARAM = "debugRedux";

export interface StoreConfig<TState> {
  reducers: ReducersMapObject<TState>;
  preloadedState?: PreloadedState<TState>;
  effects?: object[];
  devTools?: boolean;
  extraMiddlewares?: Middleware[];
}

export interface AsyncStore<TState> extends Store<TState> {
  registerAsyncReducers: (
    asyncReducersFactory: () => ReducersMapObject,
    asyncEffects?: object[]
  ) => void;
}

export interface ServerSideStore<TState> extends Store<TState> {
  handleServerSideRendering: (config: {
    init: () => void;
    onReady$: (state$: Observable<TState>) => Observable<unknown>;
    timeoutInMs?: number;
  }) => Promise<GetServerSidePropsResult<{}>>;
}

const createStore = <TState = object>(
  config: StoreConfig<TState>
): AsyncStore<TState> => {
  const middlewares: Middleware[] = [];
  let epicMiddleware: EpicMiddleware<any> | undefined;
  const isDevelopment = process.env.NODE_ENV === "development";

  if (config.effects) {
    epicMiddleware = createEpicMiddleware();
    middlewares.push(epicMiddleware);
  }

  if (config.extraMiddlewares && config.extraMiddlewares.length > 0) {
    middlewares.push(...config.extraMiddlewares);
  }

  // super minimal config to see what's going on
  middlewares.push(
    createLogger({
      stateTransformer: () => "-",
      actionTransformer: (action) => action.type,
    })
  );

  let composeEnhancer: any = compose;
  if (
    config.devTools === true ||
    (typeof location !== "undefined" &&
      location.search.indexOf(DEBUG_REDUX_QUERY_PARAM) > -1) ||
    (typeof config.devTools === "undefined" && isDevelopment)
  ) {
    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    const devToolsExtensionKey = "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__";
    if (
      typeof window !== "undefined" &&
      typeof (window as any)[devToolsExtensionKey] !== "undefined"
    ) {
      composeEnhancer = window[devToolsExtensionKey]({});
    } else {
      console.warn(
        "Redux Dev Tools extension is not found. Make sure you installed and enabled it."
      );
    }
  }

  const store = createReduxStore(
    combineReducers(config.reducers),
    config.preloadedState,
    composeEnhancer(applyMiddleware(...middlewares))
  );

  // Documentation of adding epics async: https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
  const effects$ = new BehaviorSubject(undefined);
  if (config.effects && epicMiddleware) {
    effects$.next(combineEpics(...extractMultipleEffects(config.effects)));
    epicMiddleware.run((action$, state$) =>
      effects$.pipe(mergeMap((epic) => epic(action$, state$, {})))
    );
  }

  const reducersMap: Map<unknown, ReducersMapObject> = new Map();
  reducersMap.set(config.reducers, config.reducers);

  (store as AsyncStore<TState>).registerAsyncReducers = (
    asyncReducersFactory,
    asyncEffects
  ) => {
    if (reducersMap.has(asyncReducersFactory)) {
      return;
    }
    reducersMap.set(asyncReducersFactory, asyncReducersFactory());
    let updatedReducers: ReducersMapObject<any> = {};
    reducersMap.forEach((map) => {
      updatedReducers = { ...updatedReducers, ...map };
    });
    // Documentation of adding reducers async: https://redux.js.org/api/store/#replacereducernextreducer
    store.replaceReducer(combineReducers(updatedReducers));

    if (asyncEffects) {
      extractMultipleEffects(asyncEffects).forEach((effect) =>
        effects$.next(effect)
      );
    }
  };

  // TODO: only define when SSR
  (store as ServerSideStore<TState>).handleServerSideRendering = ({
    init,
    onReady$,
    timeoutInMs = 1500,
  }) => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      init();
      const state$ = new BehaviorSubject<TState>(store.getState());
      const unsubscribeFromStore = store.subscribe(() =>
        state$.next(store.getState())
      );

      const handleFinish = () => {
        // TODO: clean up effects
        unsubscribeFromStore();
        resolve({ props: {} });
      };

      onReady$(state$)
        .pipe(take(1), timeout(timeoutInMs))
        .subscribe({
          complete: () => {
            console.log(
              `HANDLER_SSR_REDUX FINISHED IN ${Date.now() - start}ms`
            );
            handleFinish();
          },
          error: (err) => {
            console.error("ERROR IN HANDLER_SSR_REDUX", err);
            handleFinish();
          },
        });
    });
  };

  return store as AsyncStore<TState>;
};

const reduxConfig: StoreConfig<AppState> = {
  reducers: {
    book: bookReducer,
  },
  effects: [BookEffect],
  devTools: true,
};

const makeStore = (context: Context) => {
  return createStore(reduxConfig);
};

// export an assembled wrapper
export const wrapper = createWrapper<Store<AppState>>(makeStore, {
  debug: false,
});
