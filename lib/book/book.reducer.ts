import { Action, createReducer } from "typesafe-actions";
import { BookAction } from "./book.action";
import { BookState } from "./book.model";

const initialState: BookState = {
  isLoading: false,
  query: "",
  totalItems: 0,
  books: [],
};

export const bookReducer = createReducer<BookState, Action>(initialState)
  .handleAction(BookAction.search.request, (state, { payload }) => ({
    ...state,
    isLoading: true,
    query: payload.query,
  }))
  .handleAction(BookAction.search.success, (state, { payload }) => ({
    ...state,
    isLoading: false,
    books: payload.items,
    totalItems: payload.totalItems,
  }))
  .handleAction(BookAction.search.failure, (state, { payload }) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.message,
  }));
