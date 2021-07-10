import {Column, Entity} from "typeorm";
import {HistoryActionColumn, HistoryActionType, HistoryEntityInterface} from "typeorm-revisions";
import {Order} from "../Order";

@Entity()
export class OrderHistory extends Order implements HistoryEntityInterface {
    @Column()
    public originalID!: number;
    @HistoryActionColumn()
    public action!: HistoryActionType;
    makeActionAt: Date;
}
