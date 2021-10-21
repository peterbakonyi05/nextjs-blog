import { Action, createReducer } from "typesafe-actions";
import { BookAction } from "./book.action";
import { BookState } from "./book.model";
import { HydrateAction } from "../hydrate/hydrate.action";

const initialState: BookState = {
  isLoading: false,
  query: "",
  totalItems: 0,
  books: [],
  isSsrReady: false,
};

export const bookReducer = createReducer<BookState, Action>(initialState)
  .handleAction(BookAction.search.request, (state, { payload }) => ({
    ...state,
    isLoading: true,
    query: payload.query || "",
  }))
  .handleAction(BookAction.search.success, (state, { payload }) => ({
    ...state,
    isLoading: false,
    isSsrReady: true,
    books: payload.items,
    totalItems: payload.totalItems,
  }))
  .handleAction(BookAction.search.failure, (state, { payload }) => ({
    ...state,
    isLoading: false,
    isSsrReady: true,
    errorMessage: payload.message,
  }))
  // payload is the entire state sent from the server
  .handleAction(HydrateAction.hydrate, (state, { payload }) => {
    return {
      ...state,
      ...payload.book,
    };
  });
