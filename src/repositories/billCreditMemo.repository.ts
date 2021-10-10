import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {BillCreditMemo} from "../models/BillCreditMemo";

export class BillCreditMemoRepository<T> extends BaseRepository<BillCreditMemo>{
    protected readonly repositoryManager : Repository<BillCreditMemo>;

    constructor(){
        super();
        this.repositoryManager = getRepository(BillCreditMemo);
    }
}
