import {MigrationInterface, QueryRunner} from "typeorm";

export class updateProductAndSize1638020690428 implements MigrationInterface {
    name = 'updateProductAndSize1638020690428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `ProductSize` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(60) NOT NULL, `color` varchar(100) NOT NULL, `quantity` int NOT NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Size` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(60) NOT NULL, `reference_key` varchar(4) NOT NULL, `start_from` int NULL, `sizes` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ProductImage` (`id` int NOT NULL AUTO_INCREMENT, `group` int NOT NULL, `thumbs` json NOT NULL, `filename` varchar(100) NOT NULL, `path` varchar(300) NOT NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Product` (`id` int NOT NULL AUTO_INCREMENT, `reference` varchar(20) NOT NULL, `name` varchar(255) NOT NULL, `description` varchar(800) NULL, `material` varchar(150) NULL, `provider` varchar(150) NULL, `price` decimal NOT NULL, `cost` decimal NOT NULL, `discount` decimal NULL DEFAULT '0', `weight` decimal NOT NULL, `tags` varchar(255) NULL, `reference_key` varchar(4) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `imagesQuantity` int NOT NULL DEFAULT '0', `published` tinyint NOT NULL DEFAULT '0', `status` tinyint NOT NULL, `category_id` int NULL, `size_id` int NULL, UNIQUE INDEX `IDX_5b80d47fbfa9e551f33560a51a` (`reference`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Category` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` tinyint NOT NULL, UNIQUE INDEX `IDX_0ac420e8701e781dbf1231dc23` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `State` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `dian_code` varchar(10) NOT NULL, `iso_code` varchar(5) NOT NULL, `status` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Municipality` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(200) NOT NULL, `dian_code` varchar(10) NOT NULL, `status` tinyint NOT NULL, `state_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `TemporalAddress` (`id` int NOT NULL AUTO_INCREMENT, `state` varchar(255) NOT NULL, `municipality` varchar(255) NOT NULL, `customer_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Customer` (`id` int NOT NULL AUTO_INCREMENT, `document` varchar(100) NOT NULL, `name` varchar(100) NOT NULL, `email` varchar(300) NULL, `phone` varchar(30) NOT NULL, `cellphone` varchar(45) NOT NULL, `isMayorist` tinyint NOT NULL, `hasNotification` tinyint NOT NULL, `status` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `state_id` int NULL, `municipality_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `DeliveryLocality` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `delivery_area_code` varchar(100) NOT NULL, `time_in_days` int NOT NULL, `delivery_type` int NOT NULL, `price_first_kilo` double NOT NULL, `price_additional_kilo` double NOT NULL, `status` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `FieldOption` (`id` int NOT NULL AUTO_INCREMENT, `group` varchar(100) NOT NULL, `name` varchar(100) NOT NULL, `value` varchar(600) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `User` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `lastname` varchar(30) NOT NULL, `email` varchar(300) NULL, `username` varchar(45) NOT NULL, `password` varchar(300) NOT NULL, `salt` varchar(300) NOT NULL, `status` tinyint NOT NULL, `last_login` datetime NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `ProductSize` ADD CONSTRAINT `FK_ff7200aac31bcdcc8deb4bae7c9` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ProductImage` ADD CONSTRAINT `FK_fd99f86cd68db2223add8702a08` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Product` ADD CONSTRAINT `FK_f9b5114e0cfa9a3c5bdf606aedb` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Product` ADD CONSTRAINT `FK_2ac5de51b8c006a086346fe5555` FOREIGN KEY (`size_id`) REFERENCES `Size`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Municipality` ADD CONSTRAINT `FK_81a891872a355077ac0cfb2701e` FOREIGN KEY (`state_id`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `TemporalAddress` ADD CONSTRAINT `FK_77d05a186d671298d761153d895` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Customer` ADD CONSTRAINT `FK_6e7f464caa94ec475c7261cf9d9` FOREIGN KEY (`state_id`) REFERENCES `State`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Customer` ADD CONSTRAINT `FK_d82e293a57749f34464d55b3f7b` FOREIGN KEY (`municipality_id`) REFERENCES `Municipality`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `Customer` DROP FOREIGN KEY `FK_d82e293a57749f34464d55b3f7b`");
        await queryRunner.query("ALTER TABLE `Customer` DROP FOREIGN KEY `FK_6e7f464caa94ec475c7261cf9d9`");
        await queryRunner.query("ALTER TABLE `TemporalAddress` DROP FOREIGN KEY `FK_77d05a186d671298d761153d895`");
        await queryRunner.query("ALTER TABLE `Municipality` DROP FOREIGN KEY `FK_81a891872a355077ac0cfb2701e`");
        await queryRunner.query("ALTER TABLE `Product` DROP FOREIGN KEY `FK_2ac5de51b8c006a086346fe5555`");
        await queryRunner.query("ALTER TABLE `Product` DROP FOREIGN KEY `FK_f9b5114e0cfa9a3c5bdf606aedb`");
        await queryRunner.query("ALTER TABLE `ProductImage` DROP FOREIGN KEY `FK_fd99f86cd68db2223add8702a08`");
        await queryRunner.query("ALTER TABLE `ProductSize` DROP FOREIGN KEY `FK_ff7200aac31bcdcc8deb4bae7c9`");
        await queryRunner.query("DROP TABLE `User`");
        await queryRunner.query("DROP TABLE `FieldOption`");
        await queryRunner.query("DROP TABLE `DeliveryLocality`");
        await queryRunner.query("DROP TABLE `Customer`");
        await queryRunner.query("DROP TABLE `TemporalAddress`");
        await queryRunner.query("DROP TABLE `Municipality`");
        await queryRunner.query("DROP TABLE `State`");
        await queryRunner.query("DROP INDEX `IDX_0ac420e8701e781dbf1231dc23` ON `Category`");
        await queryRunner.query("DROP TABLE `Category`");
        await queryRunner.query("DROP INDEX `IDX_5b80d47fbfa9e551f33560a51a` ON `Product`");
        await queryRunner.query("DROP TABLE `Product`");
        await queryRunner.query("DROP TABLE `ProductImage`");
        await queryRunner.query("DROP TABLE `Size`");
        await queryRunner.query("DROP TABLE `ProductSize`");
    }

}
