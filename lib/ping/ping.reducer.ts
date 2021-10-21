import { Action, createReducer } from "typesafe-actions";
import { UniversalAction } from "../universal/universal.action";
import { PingAction } from "./ping.action";
import { PingState } from "./ping.model";

const initialState: PingState = {};

export const pingReducer = createReducer<PingState, Action>(initialState)
  .handleAction(PingAction.ping, (state) => ({
    ...state,
    status: "ping",
  }))
  .handleAction(PingAction.pong, (state) => ({
    ...state,
    status: "pong",
  }))
  .handleAction(UniversalAction.hydrate, (state, { payload }) => ({
    ...state,
    ...payload.ping,
  }));
