import {BaseService} from "../common/controllers/base.service";
import {State} from "../models/State";
import {StateRepository} from "../repositories/state.repository";

export class StateService extends BaseService<State> {
    constructor(
        private readonly stateRepository: StateRepository<State>
    ){
        super(stateRepository);
    }
}
