import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1647034928197 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1647034928197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `security_permission` (`id` int NOT NULL AUTO_INCREMENT, `permission` varchar(100) NOT NULL, `description` varchar(300) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `security_rol` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `security_rol_permissions_security_permission` (`securityRolId` int NOT NULL, `securityPermissionId` int NOT NULL, INDEX `IDX_494ca42233847672fb433b27a2` (`securityRolId`), INDEX `IDX_15c6abb347755a3c61f54d76eb` (`securityPermissionId`), PRIMARY KEY (`securityRolId`, `securityPermissionId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `User` ADD `security_role_id` int NULL");
        await queryRunner.query("ALTER TABLE `security_rol_permissions_security_permission` ADD CONSTRAINT `FK_494ca42233847672fb433b27a2e` FOREIGN KEY (`securityRolId`) REFERENCES `security_rol`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `security_rol_permissions_security_permission` ADD CONSTRAINT `FK_15c6abb347755a3c61f54d76ebe` FOREIGN KEY (`securityPermissionId`) REFERENCES `security_permission`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
