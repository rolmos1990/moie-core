import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1638024307442 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1638024307442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `Payment` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(300) NOT NULL, `phone` varchar(30) NOT NULL, `type` varchar(255) NOT NULL, `bank` varchar(255) NOT NULL, `number` varchar(255) NOT NULL, `amount` decimal NOT NULL, `email` varchar(255) NOT NULL, `origen` varchar(150) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
