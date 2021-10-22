import { inject, injectable } from "inversify";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@app/core";

import { BooksResponse } from "./book.model";

const api = "https://www.googleapis.com/books/v1/volumes";

@injectable()
export class BookService {
  constructor(@inject(HttpClient) private httpClient: HttpClient) {}

  getBooks(
    query: string,
    startIndex = 0,
    maxResults = 10
  ): Observable<BooksResponse> {
    if (!query) {
      return of({ totalItems: 0, items: [] });
    }
    query = query.toLowerCase().replace(/\s/, "+");
    return this.httpClient
      .request<BooksResponse>({
        url: `${api}?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`,
      })
      .pipe(map((response) => response.response));
  }
}
