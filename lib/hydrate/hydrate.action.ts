import { HYDRATE } from "next-redux-wrapper";
import { createAction } from "typesafe-actions";

export const HydrateAction = {
  hydrate: createAction(HYDRATE)<any>(),
};
