import { inject, injectable } from "inversify";
import {
  filter,
  map,
  switchMap,
  catchError,
  throttleTime,
} from "rxjs/operators";
import { of } from "rxjs";
import { isActionOf } from "typesafe-actions";
import { createEffect } from "@app/redux";
import { BookAction } from "./book.action";
import { BookService } from "./book.service";

@injectable()
export class BookEffect {
  constructor(@inject(BookService) private bookService: BookService) {}

  search$ = createEffect((action$) =>
    action$.pipe(
      filter(isActionOf(BookAction.search.request)),
      throttleTime(100),
      switchMap(({ payload }) =>
        this.bookService.getBooks(payload.query).pipe(
          map((response) => BookAction.search.success(response)),
          catchError((err) => of(BookAction.search.failure(err)))
        )
      )
    )
  );
}
