import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1630178901286 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1630178901286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `BillConfig` (`id` int NOT NULL AUTO_INCREMENT, `number` varchar(100) NOT NULL, `start_number` bigint NOT NULL, `final_number` bigint NOT NULL, `prefix` varchar(5) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` tinyint NOT NULL, UNIQUE INDEX `IDX_8b94a836e2b6e5bf5fd2c9d5c7` (`number`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `BillCreditMemo` (`id` int NOT NULL AUTO_INCREMENT, `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `bill_id` int NULL, UNIQUE INDEX `REL_8bd81aab043f1581549f659a1b` (`bill_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Bill` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `tax` decimal NOT NULL, `legal_number` bigint NOT NULL, `status` varchar(100) NOT NULL, `order_id` int NULL, `bill_config_id` int NULL, UNIQUE INDEX `REL_668831b0ab47967e354d4c326e` (`order_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `BillCreditMemo` ADD CONSTRAINT `FK_8bd81aab043f1581549f659a1ba` FOREIGN KEY (`bill_id`) REFERENCES `Bill`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Bill` ADD CONSTRAINT `FK_668831b0ab47967e354d4c326e9` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Bill` ADD CONSTRAINT `FK_b120afd3df387d6311d7c4f2e1a` FOREIGN KEY (`bill_config_id`) REFERENCES `BillConfig`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
