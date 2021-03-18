import {BaseController} from "../common/controllers/base.controller";
import {State} from "../models/State";
import {EntityTarget} from "typeorm";
import {StateService} from "../services/state.service";
import {route} from "awilix-express";

@route('/state')
export class StateController extends BaseController<State> {
    constructor(
        private readonly stateService: StateService
    ){
        super(stateService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<State> {
        return State;
    }

    getInstance(): Object {
        return new State();
    }

    getParseGET(entity: State): Object {
        return entity;
    }

    getParsePOST(entity: State): Object {
        return entity;
    }

    getParsePUT(entity: State): Object {
        return entity;
    }

}
