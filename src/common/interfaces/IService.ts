import {EntityTarget} from "typeorm";

export interface IService{
    count: Function,
    all: Function,
    find: Function,
    delete: Function,
    createOrUpdate: Function,
    findByWithPage: Function
};
