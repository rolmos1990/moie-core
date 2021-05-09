import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1620602477930 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1620602477930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `OrderDetail`");
        await queryRunner.query("DROP TABLE `Order`");
        await queryRunner.query("CREATE TABLE `OrderDetail` (`id` int NOT NULL AUTO_INCREMENT, `color` varchar(800) NULL, `size` varchar(100) NOT NULL, `origen` varchar(150) NOT NULL, `price` decimal NOT NULL, `cost` decimal NULL DEFAULT '0', `revenue` decimal NULL DEFAULT '0', `weight` decimal NULL DEFAULT '0', `discountPercent` decimal NOT NULL, `order_id` int NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Order` (`id` int NOT NULL AUTO_INCREMENT, `delivery_cost` decimal NOT NULL, `charge_on_delivery` tinyint NOT NULL, `origen` varchar(150) NULL, `total_amount` decimal NOT NULL, `sub_total` decimal NOT NULL, `total_discount` decimal NULL DEFAULT '0', `total_revenue` decimal NULL DEFAULT '0', `total_weight` decimal NOT NULL, `tracking` varchar(200) NULL, `remember` tinyint NULL, `paymentMode` int NULL, `pieces_for_changes` int NULL, `delivery_type` int NULL, `expired_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` int NOT NULL, `customer_id` int NULL, `delivery_method_id` int NULL, `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `OrderDetail` ADD CONSTRAINT `FK_b770c92e99e28d83c8aa72dba75` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDetail` ADD CONSTRAINT `FK_8921c1dc9426c5e6d050dc56035` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_40eadba67cc475108f9062fe63c` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_0e746ed8426500c052eb7ae946f` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_8a7c8fd5a1a997d18774b7f2b24` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
