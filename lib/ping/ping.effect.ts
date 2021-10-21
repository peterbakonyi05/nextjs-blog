import { delay, filter, map, tap } from "rxjs";
import { isActionOf } from "typesafe-actions";
import { createEffect } from "../createEffect";
import { PingAction } from "./ping.action";

export const PingEffect = {
  ping: createEffect((action$) =>
    action$.pipe(
      filter(isActionOf(PingAction.ping)),
      tap(() => console.log("RUNNING BookAction.ping.request")),
      // depending on the delay this action may be dispatched or not
      delay(500),
      map(() => PingAction.pong())
    )
  ),
};
