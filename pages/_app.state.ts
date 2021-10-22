import { BookModuleState, createBookModule } from "@app/book";
import { createStore, StoreConfig } from "@app/redux";
import { Store } from "redux";
import { CORE_EFFECTS, createCoreModule, createCoreReducers } from "@app/core";
import { BOOK_EFFECTS, createBookReducers } from "@app/book";
import { Context, createWrapper } from "next-redux-wrapper";

import { CoreState } from "@app/core";
import { Container, interfaces } from "inversify";

export interface AppState extends CoreState, BookModuleState {}

export const inversifyContainer = new Container({ defaultScope: "Singleton" });
inversifyContainer.load(createCoreModule(), createBookModule());

const reduxConfig: StoreConfig<AppState> = {
  reducers: {
    ...createCoreReducers(),
    ...createBookReducers(),
  },
  effects: [...CORE_EFFECTS, ...BOOK_EFFECTS].map(
    (effect: interfaces.ServiceIdentifier<object>) =>
      inversifyContainer.get(effect)
  ),
  devTools: true,
};

// export an assembled wrapper
export const nextReduxWrapper = createWrapper<Store<AppState>>(
  (context: Context) => createStore(reduxConfig),
  {
    debug: false,
  }
);
