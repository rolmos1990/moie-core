import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1638024140501 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1638024140501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `State` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `dian_code` varchar(10) NOT NULL, `iso_code` varchar(5) NOT NULL, `status` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Municipality` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(200) NOT NULL, `dian_code` varchar(10) NOT NULL, `status` tinyint NOT NULL, `state_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `TemporalAddress` (`id` int NOT NULL AUTO_INCREMENT, `state` varchar(255) NOT NULL, `municipality` varchar(255) NOT NULL, `customer_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Customer` (`id` int NOT NULL AUTO_INCREMENT, `document` varchar(100) NOT NULL, `name` varchar(100) NOT NULL, `email` varchar(300) NULL, `phone` varchar(30) NOT NULL, `cellphone` varchar(45) NOT NULL, `isMayorist` tinyint NOT NULL, `hasNotification` tinyint NOT NULL, `address` varchar(300) NULL, `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `state_id` int NULL, `municipality_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `DeliveryMethod` (`id` int NOT NULL AUTO_INCREMENT, `code` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `settings` set ('1', '2', '3') NOT NULL DEFAULT '1', `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ProductSize` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(60) NOT NULL, `color` varchar(100) NOT NULL, `quantity` int NOT NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Size` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(60) NOT NULL, `sizes` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Category` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` tinyint NOT NULL, UNIQUE INDEX `IDX_0ac420e8701e781dbf1231dc23` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ProductImage` (`id` int NOT NULL AUTO_INCREMENT, `group` int NOT NULL, `thumbs` json NOT NULL, `filename` varchar(100) NOT NULL, `path` varchar(300) NOT NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Product` (`id` int NOT NULL AUTO_INCREMENT, `reference` varchar(20) NOT NULL, `name` varchar(255) NOT NULL, `description` varchar(800) NULL, `material` varchar(150) NULL, `provider` varchar(150) NULL, `price` decimal NOT NULL, `cost` decimal NOT NULL, `discount` decimal NULL DEFAULT '0', `weight` decimal NOT NULL, `tags` varchar(255) NULL, `reference_key` varchar(4) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `imagesQuantity` int NOT NULL DEFAULT '0', `published` tinyint NOT NULL DEFAULT '0', `status` tinyint NOT NULL, `category_id` int NULL, `size_id` int NULL, UNIQUE INDEX `IDX_5b80d47fbfa9e551f33560a51a` (`reference`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `OrderDetail` (`id` int NOT NULL AUTO_INCREMENT, `color` varchar(800) NULL, `size` varchar(100) NOT NULL, `quantity` int NOT NULL, `price` decimal NOT NULL, `cost` decimal NULL DEFAULT '0', `revenue` decimal NULL DEFAULT '0', `weight` decimal NULL DEFAULT '0', `discountPercent` decimal NOT NULL, `order_id` int NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Notification` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(200) NOT NULL, `dian_code` varchar(1000) NOT NULL, `type` varchar(200) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, `state_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `User` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `lastname` varchar(30) NOT NULL, `photo` text NOT NULL, `email` varchar(300) NULL, `username` varchar(45) NOT NULL, `password` varchar(300) NOT NULL, `salt` varchar(300) NOT NULL, `status` tinyint NOT NULL, `last_login` datetime NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `DeliveryLocality` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `delivery_area_code` varchar(100) NOT NULL, `time_in_days` int NOT NULL, `delivery_type` int NOT NULL, `price_first_kilo` double NOT NULL, `price_additional_kilo` double NOT NULL, `status` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `OrderDelivery` (`id` int NOT NULL AUTO_INCREMENT, `delivery_cost` decimal NOT NULL, `deliveryState` varchar(200) NULL, `deliveryMunicipality` varchar(200) NULL, `tracking` varchar(200) NULL, `delivery_status` varchar(200) NULL, `delivery_date` datetime NULL, `charge_on_delivery` tinyint NOT NULL, `delivery_type` int NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `order_id` int NULL, `deliveryLocality_id` int NULL, UNIQUE INDEX `REL_37e31f4a7282381dddb7e437fa` (`order_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Office` (`id` int NOT NULL AUTO_INCREMENT, `batchDate` datetime NOT NULL, `name` varchar(60) NOT NULL, `type` int NOT NULL, `description` varchar(150) NOT NULL, `status` int NOT NULL, `delivery_method_id` int NULL, `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Payment` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(300) NOT NULL, `phone` varchar(30) NOT NULL, `type` varchar(255) NOT NULL, `bank` varchar(255) NOT NULL, `number` varchar(255) NOT NULL, `amount` decimal NOT NULL, `email` varchar(255) NOT NULL, `origen` varchar(150) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Order` (`id` int NOT NULL AUTO_INCREMENT, `origen` varchar(150) NULL, `total_amount` decimal NOT NULL, `sub_total` decimal NOT NULL, `total_discount` decimal NULL DEFAULT '0', `total_revenue` decimal NULL DEFAULT '0', `total_weight` decimal NOT NULL, `enable_post_sale` tinyint NOT NULL DEFAULT 1, `remember` tinyint NULL, `paymentMode` int NULL, `pieces_for_changes` int NULL, `quantity` int NOT NULL, `expired_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `date_of_sale` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` int NOT NULL, `customer_id` int NULL, `delivery_method_id` int NULL, `user_id` int NULL, `office_id` int NULL, `order_delivery_id` int NULL, `payment_id` int NULL, UNIQUE INDEX `REL_060e11b7aa1f9f4040c8a5c53d` (`order_delivery_id`), UNIQUE INDEX `REL_206c43363a3a9a895d1d419d33` (`payment_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `order_history` (`id` int NOT NULL AUTO_INCREMENT, `origen` varchar(150) NULL, `total_amount` decimal NOT NULL, `sub_total` decimal NOT NULL, `total_discount` decimal NULL DEFAULT '0', `total_revenue` decimal NULL DEFAULT '0', `total_weight` decimal NOT NULL, `enable_post_sale` tinyint NOT NULL DEFAULT 1, `remember` tinyint NULL, `paymentMode` int NULL, `pieces_for_changes` int NULL, `quantity` int NOT NULL, `expired_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `date_of_sale` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` int NOT NULL, `originalID` int NOT NULL, `action` enum ('CREATED', 'UPDATED', 'DELETED') NOT NULL DEFAULT 'CREATED', `customer_id` int NULL, `delivery_method_id` int NULL, `user_id` int NULL, `office_id` int NULL, `order_delivery_id` int NULL, `payment_id` int NULL, UNIQUE INDEX `REL_0dff0420f1adad4d188f805eec` (`order_delivery_id`), UNIQUE INDEX `REL_9717d6c08685d44909b2e87c16` (`payment_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `BatchRequest` (`id` int NOT NULL AUTO_INCREMENT, `body` text NOT NULL, `type` int NOT NULL, `status` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `BillConfig` (`id` int NOT NULL AUTO_INCREMENT, `number` varchar(100) NOT NULL, `start_number` bigint NOT NULL, `final_number` bigint NOT NULL, `prefix` varchar(5) NOT NULL, `resolution_date` varchar(100) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` tinyint NOT NULL, UNIQUE INDEX `IDX_8b94a836e2b6e5bf5fd2c9d5c7` (`number`), UNIQUE INDEX `IDX_d17a1715c55137d527853f743c` (`resolution_date`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `BillCreditMemo` (`id` int NOT NULL AUTO_INCREMENT, `memoType` varchar(100) NOT NULL, `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `bill_id` int NULL, UNIQUE INDEX `IDX_3814a920013ce97080426bc72b` (`memoType`), UNIQUE INDEX `REL_8bd81aab043f1581549f659a1b` (`bill_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Bill` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `tax` decimal NOT NULL, `legal_number` bigint NOT NULL, `status` varchar(100) NOT NULL, `order_id` int NULL, `bill_config_id` int NULL, UNIQUE INDEX `REL_668831b0ab47967e354d4c326e` (`order_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Comment` (`id` int NOT NULL AUTO_INCREMENT, `entity` varchar(255) NOT NULL, `idRelated` varchar(255) NOT NULL, `comment` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `FieldOption` (`id` int NOT NULL AUTO_INCREMENT, `groups` varchar(100) NOT NULL, `name` varchar(100) NOT NULL, `value` varchar(600) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Template` (`id` int NOT NULL AUTO_INCREMENT, `reference` varchar(100) NOT NULL, `description` varchar(100) NOT NULL, `text` text NOT NULL, `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_9965d514be97c0e94563ffcd4d` (`reference`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `Municipality` ADD CONSTRAINT `FK_81a891872a355077ac0cfb2701e` FOREIGN KEY (`state_id`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `TemporalAddress` ADD CONSTRAINT `FK_77d05a186d671298d761153d895` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Customer` ADD CONSTRAINT `FK_6e7f464caa94ec475c7261cf9d9` FOREIGN KEY (`state_id`) REFERENCES `State`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Customer` ADD CONSTRAINT `FK_d82e293a57749f34464d55b3f7b` FOREIGN KEY (`municipality_id`) REFERENCES `Municipality`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ProductSize` ADD CONSTRAINT `FK_ff7200aac31bcdcc8deb4bae7c9` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ProductImage` ADD CONSTRAINT `FK_fd99f86cd68db2223add8702a08` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Product` ADD CONSTRAINT `FK_f9b5114e0cfa9a3c5bdf606aedb` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Product` ADD CONSTRAINT `FK_2ac5de51b8c006a086346fe5555` FOREIGN KEY (`size_id`) REFERENCES `Size`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDetail` ADD CONSTRAINT `FK_b770c92e99e28d83c8aa72dba75` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDetail` ADD CONSTRAINT `FK_8921c1dc9426c5e6d050dc56035` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Notification` ADD CONSTRAINT `FK_04bd9d7b08a1ea07d84fc22f284` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Notification` ADD CONSTRAINT `FK_b8469ba7222cb0031416802a933` FOREIGN KEY (`state_id`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDelivery` ADD CONSTRAINT `FK_37e31f4a7282381dddb7e437fad` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `OrderDelivery` ADD CONSTRAINT `FK_5be0a4e8aeed91a9d1048c7ac1a` FOREIGN KEY (`deliveryLocality_id`) REFERENCES `DeliveryLocality`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Office` ADD CONSTRAINT `FK_e2d83f9a8d4f48380cf68cb04ea` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Office` ADD CONSTRAINT `FK_f0f6f14eeca57e58653693c9a33` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Payment` ADD CONSTRAINT `FK_ff087db6ed463b60a3e5a518f3f` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_40eadba67cc475108f9062fe63c` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_0e746ed8426500c052eb7ae946f` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_8a7c8fd5a1a997d18774b7f2b24` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_62d1bab8781e10fd590aab872ed` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_060e11b7aa1f9f4040c8a5c53d0` FOREIGN KEY (`order_delivery_id`) REFERENCES `OrderDelivery`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_206c43363a3a9a895d1d419d330` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_history` ADD CONSTRAINT `FK_7ec8834ccf79631a801ab032f94` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_history` ADD CONSTRAINT `FK_0581b0220f83306210e33f12ff2` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_history` ADD CONSTRAINT `FK_61871121875401d7807e617256b` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_history` ADD CONSTRAINT `FK_241050d424c2c953c24a3bb5e6c` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_history` ADD CONSTRAINT `FK_0dff0420f1adad4d188f805eec9` FOREIGN KEY (`order_delivery_id`) REFERENCES `OrderDelivery`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_history` ADD CONSTRAINT `FK_9717d6c08685d44909b2e87c162` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `BatchRequest` ADD CONSTRAINT `FK_646c27b519a493b04b4e3b63ca2` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `BillCreditMemo` ADD CONSTRAINT `FK_8bd81aab043f1581549f659a1ba` FOREIGN KEY (`bill_id`) REFERENCES `Bill`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Bill` ADD CONSTRAINT `FK_668831b0ab47967e354d4c326e9` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Bill` ADD CONSTRAINT `FK_b120afd3df387d6311d7c4f2e1a` FOREIGN KEY (`bill_config_id`) REFERENCES `BillConfig`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Comment` ADD CONSTRAINT `FK_35807048116cf822fd0ef9c0299` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("CREATE VIEW `ProductAvailableView` AS 
        SELECT id,
               (Select SUM(quantity)
                from ProductSize
                where product_id = `Product`.id
                group by ProductSize.product_id) as available,
               (Select SUM(OrderDetail.quantity) as Reserved
                from OrderDetail
                         inner join `Order` on OrderDetail.order_id = `Order`.id
                where `Order`.status = 1
                  and OrderDetail.product_id = Product.id
                group by OrderDetail.product_id) as reserved,
               (Select SUM(OrderDetail.quantity)
                from OrderDetail
                         inner join `Order` on OrderDetail.order_id = `Order`.id
                where `Order`.status IN (4, 5)
                  and OrderDetail.product_id = Product.id
                group by OrderDetail.product_id) as completed
        from Product;
    ");
        await queryRunner.query("INSERT INTO `lucy-moie-db`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","lucy-moie-db","ProductAvailableView","SELECT id,\n               (Select SUM(quantity)\n                from ProductSize\n                where product_id = `Product`.id\n                group by ProductSize.product_id) as available,\n               (Select SUM(OrderDetail.quantity) as Reserved\n                from OrderDetail\n                         inner join `Order` on OrderDetail.order_id = `Order`.id\n                where `Order`.status = 1\n                  and OrderDetail.product_id = Product.id\n                group by OrderDetail.product_id) as reserved,\n               (Select SUM(OrderDetail.quantity)\n                from OrderDetail\n                         inner join `Order` on OrderDetail.order_id = `Order`.id\n                where `Order`.status IN (4, 5)\n                  and OrderDetail.product_id = Product.id\n                group by OrderDetail.product_id) as completed\n        from Product;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `lucy-moie-db`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["lucy-moie-db","ProductAvailableView"]);
        await queryRunner.query("DROP VIEW `ProductAvailableView`");
        await queryRunner.query("ALTER TABLE `Comment` DROP FOREIGN KEY `FK_35807048116cf822fd0ef9c0299`");
        await queryRunner.query("ALTER TABLE `Bill` DROP FOREIGN KEY `FK_b120afd3df387d6311d7c4f2e1a`");
        await queryRunner.query("ALTER TABLE `Bill` DROP FOREIGN KEY `FK_668831b0ab47967e354d4c326e9`");
        await queryRunner.query("ALTER TABLE `BillCreditMemo` DROP FOREIGN KEY `FK_8bd81aab043f1581549f659a1ba`");
        await queryRunner.query("ALTER TABLE `BatchRequest` DROP FOREIGN KEY `FK_646c27b519a493b04b4e3b63ca2`");
        await queryRunner.query("ALTER TABLE `order_history` DROP FOREIGN KEY `FK_9717d6c08685d44909b2e87c162`");
        await queryRunner.query("ALTER TABLE `order_history` DROP FOREIGN KEY `FK_0dff0420f1adad4d188f805eec9`");
        await queryRunner.query("ALTER TABLE `order_history` DROP FOREIGN KEY `FK_241050d424c2c953c24a3bb5e6c`");
        await queryRunner.query("ALTER TABLE `order_history` DROP FOREIGN KEY `FK_61871121875401d7807e617256b`");
        await queryRunner.query("ALTER TABLE `order_history` DROP FOREIGN KEY `FK_0581b0220f83306210e33f12ff2`");
        await queryRunner.query("ALTER TABLE `order_history` DROP FOREIGN KEY `FK_7ec8834ccf79631a801ab032f94`");
        await queryRunner.query("ALTER TABLE `Order` DROP FOREIGN KEY `FK_206c43363a3a9a895d1d419d330`");
        await queryRunner.query("ALTER TABLE `Order` DROP FOREIGN KEY `FK_060e11b7aa1f9f4040c8a5c53d0`");
        await queryRunner.query("ALTER TABLE `Order` DROP FOREIGN KEY `FK_62d1bab8781e10fd590aab872ed`");
        await queryRunner.query("ALTER TABLE `Order` DROP FOREIGN KEY `FK_8a7c8fd5a1a997d18774b7f2b24`");
        await queryRunner.query("ALTER TABLE `Order` DROP FOREIGN KEY `FK_0e746ed8426500c052eb7ae946f`");
        await queryRunner.query("ALTER TABLE `Order` DROP FOREIGN KEY `FK_40eadba67cc475108f9062fe63c`");
        await queryRunner.query("ALTER TABLE `Payment` DROP FOREIGN KEY `FK_ff087db6ed463b60a3e5a518f3f`");
        await queryRunner.query("ALTER TABLE `Office` DROP FOREIGN KEY `FK_f0f6f14eeca57e58653693c9a33`");
        await queryRunner.query("ALTER TABLE `Office` DROP FOREIGN KEY `FK_e2d83f9a8d4f48380cf68cb04ea`");
        await queryRunner.query("ALTER TABLE `OrderDelivery` DROP FOREIGN KEY `FK_5be0a4e8aeed91a9d1048c7ac1a`");
        await queryRunner.query("ALTER TABLE `OrderDelivery` DROP FOREIGN KEY `FK_37e31f4a7282381dddb7e437fad`");
        await queryRunner.query("ALTER TABLE `Notification` DROP FOREIGN KEY `FK_b8469ba7222cb0031416802a933`");
        await queryRunner.query("ALTER TABLE `Notification` DROP FOREIGN KEY `FK_04bd9d7b08a1ea07d84fc22f284`");
        await queryRunner.query("ALTER TABLE `OrderDetail` DROP FOREIGN KEY `FK_8921c1dc9426c5e6d050dc56035`");
        await queryRunner.query("ALTER TABLE `OrderDetail` DROP FOREIGN KEY `FK_b770c92e99e28d83c8aa72dba75`");
        await queryRunner.query("ALTER TABLE `Product` DROP FOREIGN KEY `FK_2ac5de51b8c006a086346fe5555`");
        await queryRunner.query("ALTER TABLE `Product` DROP FOREIGN KEY `FK_f9b5114e0cfa9a3c5bdf606aedb`");
        await queryRunner.query("ALTER TABLE `ProductImage` DROP FOREIGN KEY `FK_fd99f86cd68db2223add8702a08`");
        await queryRunner.query("ALTER TABLE `ProductSize` DROP FOREIGN KEY `FK_ff7200aac31bcdcc8deb4bae7c9`");
        await queryRunner.query("ALTER TABLE `Customer` DROP FOREIGN KEY `FK_d82e293a57749f34464d55b3f7b`");
        await queryRunner.query("ALTER TABLE `Customer` DROP FOREIGN KEY `FK_6e7f464caa94ec475c7261cf9d9`");
        await queryRunner.query("ALTER TABLE `TemporalAddress` DROP FOREIGN KEY `FK_77d05a186d671298d761153d895`");
        await queryRunner.query("ALTER TABLE `Municipality` DROP FOREIGN KEY `FK_81a891872a355077ac0cfb2701e`");
        await queryRunner.query("DROP INDEX `IDX_9965d514be97c0e94563ffcd4d` ON `Template`");
        await queryRunner.query("DROP TABLE `Template`");
        await queryRunner.query("DROP TABLE `FieldOption`");
        await queryRunner.query("DROP TABLE `Comment`");
        await queryRunner.query("DROP INDEX `REL_668831b0ab47967e354d4c326e` ON `Bill`");
        await queryRunner.query("DROP TABLE `Bill`");
        await queryRunner.query("DROP INDEX `REL_8bd81aab043f1581549f659a1b` ON `BillCreditMemo`");
        await queryRunner.query("DROP INDEX `IDX_3814a920013ce97080426bc72b` ON `BillCreditMemo`");
        await queryRunner.query("DROP TABLE `BillCreditMemo`");
        await queryRunner.query("DROP INDEX `IDX_d17a1715c55137d527853f743c` ON `BillConfig`");
        await queryRunner.query("DROP INDEX `IDX_8b94a836e2b6e5bf5fd2c9d5c7` ON `BillConfig`");
        await queryRunner.query("DROP TABLE `BillConfig`");
        await queryRunner.query("DROP TABLE `BatchRequest`");
        await queryRunner.query("DROP INDEX `REL_9717d6c08685d44909b2e87c16` ON `order_history`");
        await queryRunner.query("DROP INDEX `REL_0dff0420f1adad4d188f805eec` ON `order_history`");
        await queryRunner.query("DROP TABLE `order_history`");
        await queryRunner.query("DROP INDEX `REL_206c43363a3a9a895d1d419d33` ON `Order`");
        await queryRunner.query("DROP INDEX `REL_060e11b7aa1f9f4040c8a5c53d` ON `Order`");
        await queryRunner.query("DROP TABLE `Order`");
        await queryRunner.query("DROP TABLE `Payment`");
        await queryRunner.query("DROP TABLE `Office`");
        await queryRunner.query("DROP INDEX `REL_37e31f4a7282381dddb7e437fa` ON `OrderDelivery`");
        await queryRunner.query("DROP TABLE `OrderDelivery`");
        await queryRunner.query("DROP TABLE `DeliveryLocality`");
        await queryRunner.query("DROP TABLE `User`");
        await queryRunner.query("DROP TABLE `Notification`");
        await queryRunner.query("DROP TABLE `OrderDetail`");
        await queryRunner.query("DROP INDEX `IDX_5b80d47fbfa9e551f33560a51a` ON `Product`");
        await queryRunner.query("DROP TABLE `Product`");
        await queryRunner.query("DROP TABLE `ProductImage`");
        await queryRunner.query("DROP INDEX `IDX_0ac420e8701e781dbf1231dc23` ON `Category`");
        await queryRunner.query("DROP TABLE `Category`");
        await queryRunner.query("DROP TABLE `Size`");
        await queryRunner.query("DROP TABLE `ProductSize`");
        await queryRunner.query("DROP TABLE `DeliveryMethod`");
        await queryRunner.query("DROP TABLE `Customer`");
        await queryRunner.query("DROP TABLE `TemporalAddress`");
        await queryRunner.query("DROP TABLE `Municipality`");
        await queryRunner.query("DROP TABLE `State`");
    }

}
