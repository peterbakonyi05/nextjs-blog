/**
 * NOTE: this is taken from `buy` project for the sake of the POC
 */
import { Epic } from "redux-observable";
import { Observable, OperatorFunction } from "rxjs";
import { filter, mapTo } from "rxjs/operators";
import { Action } from "typesafe-actions";

const SKIP_DISPATCH_TYPE = "__skip_dispatch__";
const EFFECT_METADATA_KEY = "__@tundra/redux_effect__";

/**
 * Operator to create an epic that does not dispatch another action.
 *
 * Example: epic that does logging.
 */
export const skipDispatch = <T>(): OperatorFunction<T, Action> => {
  return mapTo<T, Action>({ type: SKIP_DISPATCH_TYPE });
};

type Effect<T extends Action, TState> = (
  action$: Observable<T>,
  state$: Observable<TState> & { value: TState }
) => Observable<Action>;

export const createEffect = <T extends Action, TState>(
  originalEpic: Effect<T, TState>
): Effect<T, TState> => {
  const epic = (
    action$: Observable<T>,
    state$: Observable<TState> & { value: TState }
  ): Observable<Action> =>
    originalEpic(action$, state$).pipe(
      filter(({ type }) => type !== SKIP_DISPATCH_TYPE)
    );

  Object.defineProperty(epic, EFFECT_METADATA_KEY, {
    value: true,
  });

  return epic;
};

export const extractEffects = (effects: object): Epic[] => {
  return Object.values(effects).filter(
    (effect) =>
      typeof effect === "function" && effect[EFFECT_METADATA_KEY] === true
  );
};

export const extractMultipleEffects = (multipleEffects: object[]): Epic[] =>
  multipleEffects.reduce<Epic[]>(
    (effects, current) => effects.concat(extractEffects(current)),
    []
  );
