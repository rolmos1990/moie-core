import {
    Column, JoinColumn, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    ViewEntity
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Office} from "./Office";
import {Product} from "./Product";

@ViewEntity({
    name: 'officeorders',
    expression: `
        SELECT \`moie-lucy-v2\`.\`office\`.\`id\`       AS \`id\`,
               COUNT(\`moie-lucy-v2\`.\`order\`.\`id\`) AS \`quantity\`
        FROM (\`moie-lucy-v2\`.\`office\`
            LEFT JOIN \`moie-lucy-v2\`.\`order\` ON ((\`moie-lucy-v2\`.\`order\`.\`office_id\` =
                                                      \`moie-lucy-v2\`.\`office\`.\`id\`)))
        GROUP BY \`moie-lucy-v2\`.\`office\`.\`id\`
    `
})

export class ViewOfficeOrders extends BaseModel{

    @PrimaryGeneratedColumn()
    @OneToOne(() => Office, office => office.viewOrders)
    @JoinColumn({name:'id'})
    id: number;

    @Column({name:'quantity'})
    quantity: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
