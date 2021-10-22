import { ContainerModule } from "inversify";
import { ReducersMapObject } from "redux";
import { HttpClient } from ".";
import { CoreState } from "./core.state";
import { PingEffect } from "./ping/ping.effect";
import { pingReducer } from "./ping/ping.reducer";

export const createCoreReducers = (): ReducersMapObject<CoreState> => ({
  ping: pingReducer,
});

export const createCoreModule = () =>
  new ContainerModule((bind) => {
    bind(HttpClient).toSelf();
    bind(PingEffect).toSelf();
  });

export const CORE_EFFECTS = [PingEffect];
