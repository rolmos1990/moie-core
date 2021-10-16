import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1634405665796 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1634405665796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `Payment` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(300) NOT NULL, `phone` varchar(30) NOT NULL, `type` varchar(255) NOT NULL, `bank` varchar(255) NOT NULL, `number` varchar(255) NOT NULL, `amount` decimal NOT NULL, `email` varchar(255) NOT NULL, `origen` varchar(150) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `Order` ADD payment_id int");
        await queryRunner.query("ALTER TABLE `Order` ADD CONSTRAINT `FK_206c43363a3a9a895d1d419d330` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
