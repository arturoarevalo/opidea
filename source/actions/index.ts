import { InitAction } from './init-action';
import { BuildAction } from './build-action';
import { ServeAction } from './serve-action';

const actions = [
    new InitAction(),
    new BuildAction(),
    new ServeAction
];

export { InitAction, BuildAction, ServeAction, actions };
