import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1622383299022 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1622383299022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `Comment`");
        await queryRunner.query("CREATE TABLE `Comment` (`id` int NOT NULL AUTO_INCREMENT, `entity` varchar(255) NOT NULL, `idRelated` varchar(255) NOT NULL, `comment` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `Comment` ADD CONSTRAINT `FK_35807048116cf822fd0ef9c0299` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `Comment`");
    }

}
