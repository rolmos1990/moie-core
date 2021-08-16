import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1629084528532 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1629084528532'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("DROP TABLE `OrderDelivery`");
        await queryRunner.query("DROP TABLE `OrderDetail`");
        await queryRunner.query("DROP TABLE `Order`");
        await queryRunner.query("CREATE TABLE `OrderDetail` (`id` int NOT NULL AUTO_INCREMENT, `color` varchar(800) NULL, `size` varchar(100) NOT NULL, `quantity` int NOT NULL, `price` decimal NOT NULL, `cost` decimal NULL DEFAULT '0', `revenue` decimal NULL DEFAULT '0', `weight` decimal NULL DEFAULT '0', `discountPercent` decimal NOT NULL, `order_id` int NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `OrderDelivery` (`id` int NOT NULL AUTO_INCREMENT, `delivery_cost` decimal NOT NULL, `deliveryState` varchar(200) NULL, `deliveryMunicipality` varchar(200) NULL, `tracking` varchar(200) NULL, `delivery_status` varchar(200) NULL, `delivery_date` datetime NULL, `charge_on_delivery` tinyint NOT NULL, `delivery_type` int NULL, `order_id` int NULL, `deliveryLocality_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Order` (`id` int NOT NULL AUTO_INCREMENT, `origen` varchar(150) NULL, `total_amount` decimal NOT NULL, `sub_total` decimal NOT NULL, `total_discount` decimal NULL DEFAULT '0', `total_revenue` decimal NULL DEFAULT '0', `total_weight` decimal NOT NULL, `remember` tinyint NULL, `paymentMode` int NULL, `pieces_for_changes` int NULL, `quantity` int NOT NULL, `expired_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` int NOT NULL, `customer_id` int NULL, `delivery_method_id` int NULL, `user_id` int NULL, `office_id` int NULL, `order_delivery_id` int NULL, UNIQUE INDEX `REL_060e11b7aa1f9f4040c8a5c53d` (`order_delivery_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `OrderDetail` ADD CONSTRAINT `FK_b770c92e99e28d83c8aa72dba75` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDetail` ADD CONSTRAINT `FK_8921c1dc9426c5e6d050dc56035` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDelivery` ADD CONSTRAINT `FK_37e31f4a7282381dddb7e437fad` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDelivery` ADD CONSTRAINT `FK_5be0a4e8aeed91a9d1048c7ac1a` FOREIGN KEY (`deliveryLocality_id`) REFERENCES `DeliveryLocality`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_40eadba67cc475108f9062fe63c` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_0e746ed8426500c052eb7ae946f` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_8a7c8fd5a1a997d18774b7f2b24` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_62d1bab8781e10fd590aab872ed` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_060e11b7aa1f9f4040c8a5c53d0` FOREIGN KEY (`order_delivery_id`) REFERENCES `OrderDelivery`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
