import {
    JoinColumn,
    OneToOne, PrimaryGeneratedColumn,
    ViewColumn, ViewEntity
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Product} from "./Product";

@ViewEntity({
    name: 'availables',
    expression: `
        SELECT \`moie-lucy-v2\`.\`product\`.\`id\`                AS \`product_id\`,
               SUM(\`moie-lucy-v2\`.\`productsize\`.\`quantity\`) AS \`cantidad\`
        FROM (\`moie-lucy-v2\`.\`product\`
            JOIN \`moie-lucy-v2\`.\`productsize\` ON ((\`moie-lucy-v2\`.\`productsize\`.\`product_id\` =
                                                       \`moie-lucy-v2\`.\`product\`.\`id\`)))
        GROUP BY \`moie-lucy-v2\`.\`productsize\`.\`product_id\`
    `
})

export class ViewAvailables extends BaseModel{

    @PrimaryGeneratedColumn()
    @OneToOne(() => Product, product => product.viewAvailables)
    @JoinColumn({name:'product_id'})
    product: number;

    @ViewColumn({name:'quantity'})
    quantity: number;

    isEmpty(): boolean {
        return (this.product == null);
    }

}
