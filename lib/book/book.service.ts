import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { request } from "../request";
import { BooksResponse } from "./book.model";

const api = "https://www.googleapis.com/books/v1/volumes";

export const BookService = {
  getBooks(
    query: string,
    startIndex = 0,
    maxResults = 10
  ): Observable<BooksResponse> {
    if (!query) {
      return of({ totalItems: 0, items: [] });
    }
    query = query.toLowerCase().replace(/\s/, "+");
    return request<BooksResponse>({
      url: `${api}?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`,
    }).pipe(map((response) => response.response));
  },
};
