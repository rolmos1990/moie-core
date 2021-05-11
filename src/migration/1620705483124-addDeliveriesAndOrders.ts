import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1620705483124 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1620705483124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP VIEW `ProductAvailableView`");
        await queryRunner.query("CREATE VIEW `ProductAvailableView` AS SELECT id, (Select SUM(quantity) from ProductSize where product_id = `Product`.id group by ProductSize.product_id) as available, (Select SUM(OrderDetail.quantity) as Reserved from OrderDetail inner join `Order` on OrderDetail.order_id = `Order`.id where `Order`.status = 1 and OrderDetail.product_id = Product.id group by OrderDetail.product_id) as reserved, (Select SUM(OrderDetail.quantity) from OrderDetail inner join `Order` on OrderDetail.order_id = `Order`.id where `Order`.status IN (4, 5) and OrderDetail.product_id = Product.id group by OrderDetail.product_id) as completed from Product;");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
