import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1626022771698 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1626022771698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `BatchRequest` (`id` int NOT NULL AUTO_INCREMENT, `body` text NOT NULL, `type` int NOT NULL, `status` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `BatchRequest` ADD CONSTRAINT `FK_646c27b519a493b04b4e3b63ca2` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
