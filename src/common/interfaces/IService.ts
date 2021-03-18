import {EntityTarget} from "typeorm";

export interface IService{
    count: Function,
    all: Function,
    find: Function,
    createOrUpdate: Function
};
