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
import reduxLogger from "redux-logger";
import {
  combineEpics,
  createEpicMiddleware,
  EpicMiddleware,
} from "redux-observable";
import { BehaviorSubject } from "rxjs";

import { extractMultipleEffects } from "./createEffect";
import { mergeMap } from "rxjs/operators";
import { Context, createWrapper } from "next-redux-wrapper";
import { AppState } from "./appState.model";
import { bookReducer } from "./book/book.reducer";
import { BookEffect } from "./book/book.effect";

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

  middlewares.push(reduxLogger);

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
  debug: true,
});
