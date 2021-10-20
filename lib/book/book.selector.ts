import { AppState } from "../appState.model";
import { Book } from "./book.model";

export const BookSelector = {
  isLoading: (state: AppState): boolean => state.book.isLoading,
  books: (state: AppState): Book[] => state.book.books,
  query: (state: AppState): string => state.book.query,
};
