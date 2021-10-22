import { createAction } from "typesafe-actions";

export const PingAction = {
  ping: createAction("[Ping] Ping")(),
  pong: createAction("[Ping] Pong")(),
};
