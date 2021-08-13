import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeliveriesAndOrders1628458220306 implements MigrationInterface {
    name = 'addDeliveriesAndOrders1628458220306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `Office` (`id` int NOT NULL AUTO_INCREMENT, `batchDate` datetime NOT NULL, `name` varchar(60) NOT NULL, `type` int NOT NULL, `description` varchar(150) NOT NULL, `status` int NOT NULL, `delivery_method_id` int NULL, `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
