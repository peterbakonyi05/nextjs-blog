import { createAsyncAction } from "typesafe-actions";
import { BookSearchRequestPayload, BooksResponse } from "./book.model";

export const BookAction = {
  search: createAsyncAction(
    "[Book] Search Request",
    "[Book] Search Success",
    "[Book] Search Failure"
  )<BookSearchRequestPayload, BooksResponse, Error>(),
};
