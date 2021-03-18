import {MigrationInterface, QueryRunner} from "typeorm";

export class newMigration1615786237335 implements MigrationInterface {
    name = 'newMigration1615786237335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `State` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `dian_code` varchar(10) NOT NULL, `iso_code` varchar(5) NOT NULL, `status` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Municipality` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(200) NOT NULL, `dian_code` varchar(10) NOT NULL, `status` tinyint NOT NULL, `state_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Client` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `email` varchar(300) NULL, `phone` varchar(30) NOT NULL, `celphone` varchar(45) NOT NULL, `isMayorist` tinyint NOT NULL, `hasNotification` tinyint NOT NULL, `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `municipality_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `DeliveryLocality` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `delivery_area_code` varchar(100) NOT NULL, `time_in_days` int NOT NULL, `delivery_type` int NOT NULL, `price_first_kilo` double NOT NULL, `price_additional_kilo` double NOT NULL, `status` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `User` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `lastname` varchar(30) NOT NULL, `email` varchar(300) NULL, `username` varchar(45) NOT NULL, `password` varchar(300) NOT NULL, `salt` varchar(300) NOT NULL, `status` tinyint NOT NULL, `last_login` datetime NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `Municipality` ADD CONSTRAINT `FK_81a891872a355077ac0cfb2701e` FOREIGN KEY (`state_id`) REFERENCES `State`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Client` ADD CONSTRAINT `FK_372c08c813b5ee603a55d21fcd1` FOREIGN KEY (`municipality_id`) REFERENCES `Municipality`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `Client` DROP FOREIGN KEY `FK_372c08c813b5ee603a55d21fcd1`");
        await queryRunner.query("ALTER TABLE `Municipality` DROP FOREIGN KEY `FK_81a891872a355077ac0cfb2701e`");
        await queryRunner.query("DROP TABLE `User`");
        await queryRunner.query("DROP TABLE `DeliveryLocality`");
        await queryRunner.query("DROP TABLE `Client`");
        await queryRunner.query("DROP TABLE `Municipality`");
        await queryRunner.query("DROP TABLE `State`");
    }

}
