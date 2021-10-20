import { BookState } from "./book/book.model";

// this would be `BookModuleState` when the feautre is lazy loaded or `CoreState`/`CommonState`/`ShopState` depending on where the feature lives
export interface AppState {
  book: BookState;
}
