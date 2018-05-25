import { InitAction } from './init-action';
import { BuildAction } from './build-action';
import { ServeAction } from './serve-action';
declare const actions: (BuildAction | InitAction | ServeAction)[];
export { InitAction, BuildAction, ServeAction, actions };
