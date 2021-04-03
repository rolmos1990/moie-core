import {EntityTarget} from "typeorm";

export interface IService{
    up(limit: number, skip: number): Function,
    down: Function,
    counts: Function,
    countsNew: Function,
    processName: Function
};
