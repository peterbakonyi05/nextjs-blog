import { BookModuleState } from "../book.state";
import { Book } from "./book.model";

export const BookSelector = {
  isLoading: (state: BookModuleState): boolean => state.book.isLoading,
  books: (state: BookModuleState): Book[] => state.book.books,
  query: (state: BookModuleState): string => state.book.query,
  isSsrReady: (state: BookModuleState): boolean => state.book.isSsrReady,
};
