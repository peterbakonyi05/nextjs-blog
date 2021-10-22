import { ContainerModule } from "inversify";
import { ReducersMapObject } from "redux";
import { BookModuleState } from ".";
import { BookEffect } from "./book/book.effect";
import { bookReducer } from "./book/book.reducer";
import { BookService } from "./book/book.service";

export const createBookReducers = (): ReducersMapObject<BookModuleState> => ({
  book: bookReducer,
});

export const createBookModule = () =>
  new ContainerModule((bind) => {
    bind(BookService).toSelf();
    bind(BookEffect).toSelf();
  });

export const BOOK_EFFECTS = [BookEffect];
