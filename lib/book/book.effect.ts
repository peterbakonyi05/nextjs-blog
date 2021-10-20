import {
  filter,
  map,
  switchMap,
  catchError,
  throttleTime,
} from "rxjs/operators";
import { of } from "rxjs";
import { isActionOf } from "typesafe-actions";
import { createEffect } from "../createEffect";
import { BookAction } from "./book.action";
import { BookService } from "./book.service";

export const BookEffect = {
  search$: createEffect((action$) =>
    action$.pipe(
      filter(isActionOf(BookAction.search.request)),
      throttleTime(100),
      switchMap(({ payload }) =>
        BookService.getBooks(payload.query).pipe(
          map((response) => BookAction.search.success(response)),
          catchError((err) => of(BookAction.search.failure(err)))
        )
      )
    )
  ),
};
