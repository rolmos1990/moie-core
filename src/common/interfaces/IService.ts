import {EntityTarget} from "typeorm";

export interface IService{
    up: Function,
    down: Function,
    counts: Function,
    countsNew: Function,
    processName: Function
};
