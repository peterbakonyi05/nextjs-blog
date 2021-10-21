import { delay, filter, interval, map, switchMap, tap } from "rxjs";
import { isActionOf } from "typesafe-actions";
import { createEffect, skipDispatch } from "../createEffect";
import { PingAction } from "./ping.action";

export const PingEffect = {
  ping$: createEffect((action$) =>
    action$.pipe(
      filter(isActionOf(PingAction.ping)),
      tap(() => console.log("RUNNING BookAction.ping.request")),
      // depending on the delay this action may be dispatched or not (book request takes like 800ms to complete, so it is missed if it's bigger than that)
      delay(1500),
      map(() => PingAction.pong())
    )
  ),

  testingPureSideEffectCleanUp$: createEffect((action$) =>
    action$.pipe(
      filter(isActionOf(PingAction.ping)),
      switchMap(() =>
        interval(200).pipe(
          // this should emit until SSR is done and then stop logging
          tap((value) => console.log(`RUNNING INTERVAL ${value}`))
        )
      ),
      skipDispatch()
    )
  ),
};
