import { HYDRATE } from "next-redux-wrapper";
import { createAction } from "typesafe-actions";

export const UniversalAction = {
  hydrate: createAction(HYDRATE)<any>(),
  completeServerSide: createAction("[Universal] Complete Server Side")(),
};
