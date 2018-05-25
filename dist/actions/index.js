"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_action_1 = require("./init-action");
exports.InitAction = init_action_1.InitAction;
const build_action_1 = require("./build-action");
exports.BuildAction = build_action_1.BuildAction;
const serve_action_1 = require("./serve-action");
exports.ServeAction = serve_action_1.ServeAction;
const actions = [
    new init_action_1.InitAction(),
    new build_action_1.BuildAction(),
    new serve_action_1.ServeAction
];
exports.actions = actions;
