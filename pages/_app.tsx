import React from "react";
import { Provider } from "react-redux";
import { AppState } from "../lib/appState.model";
import { BookEffect } from "../lib/book/book.effect";
import { bookReducer } from "../lib/book/book.reducer";
import { StoreConfig, useStore } from "../lib/createStore";
import "../styles/global.scss";

const reduxConfig: StoreConfig<AppState> = {
  reducers: {
    book: bookReducer,
  },
  effects: [BookEffect],
  devTools: true,
};

export default function App({ Component, pageProps }) {
  const store = useStore({
    ...reduxConfig,
    preloadedState: pageProps.initialReduxState,
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
