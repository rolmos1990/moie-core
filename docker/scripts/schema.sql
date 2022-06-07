-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: moie-lucy-v2
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE=''+00:00'' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=''NO_AUTO_VALUE_ON_ZERO'' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BatchRequest`
--
CREATE DATABASE IF NOT EXISTS `moie-lucy-v2`;

USE `moie-lucy-v2`;

DROP TABLE IF EXISTS `BatchRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchRequest`
(
    `id`         int  NOT NULL AUTO_INCREMENT,
    `body`       text NOT NULL,
    `type`       int  NOT NULL,
    `status`     int  NOT NULL,
    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `user_id`    int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY          `FK_646c27b519a493b04b4e3b63ca2` (`user_id`),
    CONSTRAINT `FK_646c27b519a493b04b4e3b63ca2` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bill`
--

DROP TABLE IF EXISTS `Bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bill`
(
    `id`             int            NOT NULL AUTO_INCREMENT,
    `created_at`     datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `tax`            decimal(10, 0) NOT NULL,
    `legal_number`   bigint         NOT NULL,
    `status`         varchar(100)   NOT NULL,
    `order_id`       int DEFAULT NULL,
    `bill_config_id` int DEFAULT NULL,
    `dianLog`        text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `REL_668831b0ab47967e354d4c326e` (`order_id`),
    KEY              `FK_b120afd3df387d6311d7c4f2e1a` (`bill_config_id`),
    CONSTRAINT `FK_668831b0ab47967e354d4c326e9` FOREIGN KEY (`order_id`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_b120afd3df387d6311d7c4f2e1a` FOREIGN KEY (`bill_config_id`) REFERENCES `BillConfig` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BillConfig`
--

DROP TABLE IF EXISTS `BillConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BillConfig`
(
    `id`              int          NOT NULL AUTO_INCREMENT,
    `number`          varchar(100) NOT NULL,
    `start_number`    bigint       NOT NULL,
    `final_number`    bigint       NOT NULL,
    `prefix`          varchar(5)   NOT NULL,
    `resolution_date` varchar(100) NOT NULL,
    `created_at`      datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`      datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `status`          tinyint      NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_8b94a836e2b6e5bf5fd2c9d5c7` (`number`),
    UNIQUE KEY `IDX_d17a1715c55137d527853f743c` (`resolution_date`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BillCreditMemo`
--

DROP TABLE IF EXISTS `BillCreditMemo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BillCreditMemo`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `memoType`   varchar(100) NOT NULL,
    `status`     tinyint      NOT NULL,
    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `bill_id`    int DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `REL_8bd81aab043f1581549f659a1b` (`bill_id`),
    CONSTRAINT `FK_8bd81aab043f1581549f659a1ba` FOREIGN KEY (`bill_id`) REFERENCES `Bill` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category`
(
    `id`               int          NOT NULL AUTO_INCREMENT,
    `name`             varchar(100) NOT NULL,
    `created_at`       datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`       datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `status`           tinyint      NOT NULL,
    `discount_percent` float(10, 2
) DEFAULT ''0.00'',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0ac420e8701e781dbf1231dc23` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `entity`     varchar(255) NOT NULL,
    `idRelated`  varchar(255) NOT NULL,
    `comment`    varchar(255) NOT NULL,
    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `user_id`    int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY          `FK_35807048116cf822fd0ef9c0299` (`user_id`),
    CONSTRAINT `FK_35807048116cf822fd0ef9c0299` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer`
(
    `id`              int          NOT NULL AUTO_INCREMENT,
    `document`        varchar(100) NOT NULL,
    `name`            varchar(100) NOT NULL,
    `email`           varchar(300) DEFAULT NULL,
    `phone`           varchar(30)  NOT NULL,
    `cellphone`       varchar(45)  NOT NULL,
    `isMayorist`      tinyint      NOT NULL,
    `hasNotification` tinyint      NOT NULL,
    `address`         varchar(300) DEFAULT NULL,
    `status`          tinyint      NOT NULL,
    `created_at`      datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`      datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `state_id`        int          DEFAULT NULL,
    `municipality_id` int          DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY               `FK_6e7f464caa94ec475c7261cf9d9` (`state_id`),
    KEY               `FK_d82e293a57749f34464d55b3f7b` (`municipality_id`),
    CONSTRAINT `FK_6e7f464caa94ec475c7261cf9d9` FOREIGN KEY (`state_id`) REFERENCES `State` (`id`),
    CONSTRAINT `FK_d82e293a57749f34464d55b3f7b` FOREIGN KEY (`municipality_id`) REFERENCES `Municipality` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DeliveryLocality`
--

DROP TABLE IF EXISTS `DeliveryLocality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DeliveryLocality`
(
    `id`                    int          NOT NULL AUTO_INCREMENT,
    `name`                  varchar(255) NOT NULL,
    `delivery_area_code`    varchar(100) NOT NULL,
    `time_in_days`          int          NOT NULL,
    `delivery_type`         int          NOT NULL,
    `price_first_kilo`      double       NOT NULL,
    `price_additional_kilo` double       NOT NULL,
    `status`                tinyint      NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1219 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DeliveryMethod`
--

DROP TABLE IF EXISTS `DeliveryMethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DeliveryMethod`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `code`       varchar(255) NOT NULL,
    `name`       varchar(255) NOT NULL,
    `settings` set(''1'',''2'',''3'') NOT NULL DEFAULT ''1'',
    `status`     tinyint      NOT NULL,
    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldOption`
--

DROP TABLE IF EXISTS `FieldOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FieldOption`
(
    `id`     int          NOT NULL AUTO_INCREMENT,
    `groups` varchar(100) NOT NULL,
    `name`   varchar(100) NOT NULL,
    `value`  varchar(600) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Municipality`
--

DROP TABLE IF EXISTS `Municipality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Municipality`
(
    `id`        int          NOT NULL AUTO_INCREMENT,
    `name`      varchar(200) NOT NULL,
    `dian_code` varchar(10)  NOT NULL,
    `status`    tinyint      NOT NULL,
    `state_id`  int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY         `FK_81a891872a355077ac0cfb2701e` (`state_id`),
    CONSTRAINT `FK_81a891872a355077ac0cfb2701e` FOREIGN KEY (`state_id`) REFERENCES `State` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1124 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification`
(
    `id`         int           NOT NULL AUTO_INCREMENT,
    `title`      varchar(200)  NOT NULL,
    `dian_code`  varchar(1000) NOT NULL,
    `type`       varchar(200)  NOT NULL,
    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `user_id`    int DEFAULT NULL,
    `state_id`   int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY          `FK_04bd9d7b08a1ea07d84fc22f284` (`user_id`),
    KEY          `FK_b8469ba7222cb0031416802a933` (`state_id`),
    CONSTRAINT `FK_04bd9d7b08a1ea07d84fc22f284` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_b8469ba7222cb0031416802a933` FOREIGN KEY (`state_id`) REFERENCES `State` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Office`
--

DROP TABLE IF EXISTS `Office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Office`
(
    `id`                 int          NOT NULL AUTO_INCREMENT,
    `batchDate`          datetime     NOT NULL,
    `name`               varchar(60)  NOT NULL,
    `type`               int          NOT NULL,
    `description`        varchar(150) NOT NULL,
    `status`             int          NOT NULL,
    `delivery_method_id` int DEFAULT NULL,
    `user_id`            int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY                  `FK_e2d83f9a8d4f48380cf68cb04ea` (`delivery_method_id`),
    KEY                  `FK_f0f6f14eeca57e58653693c9a33` (`user_id`),
    CONSTRAINT `FK_e2d83f9a8d4f48380cf68cb04ea` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod` (`id`),
    CONSTRAINT `FK_f0f6f14eeca57e58653693c9a33` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order`
(
    `id`                 int            NOT NULL AUTO_INCREMENT,
    `origen`             varchar(150)            DEFAULT NULL,
    `total_amount`       decimal(10, 2) NOT NULL,
    `sub_total`          decimal(10, 2) NOT NULL,
    `total_discount`     decimal(10, 2)          DEFAULT '' 0.00 '',
    `total_revenue`      decimal(10, 2)          DEFAULT '' 0.00 '',
    `total_weight`       decimal(10, 2) NOT NULL,
    `enable_post_sale`   tinyint        NOT NULL DEFAULT '' 1 '',
    `remember`           tinyint                 DEFAULT NULL,
    `paymentMode`        int                     DEFAULT NULL,
    `pieces_for_changes` int                     DEFAULT NULL,
    `quantity`           int            NOT NULL,
    `expired_date`       datetime(6) DEFAULT CURRENT_TIMESTAMP (6),
    `date_of_sale`       datetime(6) DEFAULT CURRENT_TIMESTAMP (6),
    `created_at`         datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`         datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `status`             int            NOT NULL,
    `customer_id`        int                     DEFAULT NULL,
    `delivery_method_id` int                     DEFAULT NULL,
    `user_id`            int                     DEFAULT NULL,
    `office_id`          int                     DEFAULT NULL,
    `order_delivery_id`  int                     DEFAULT NULL,
    `payment_id`         int                     DEFAULT NULL,
    `modified_date`      datetime                DEFAULT NULL,
    `prints`             int                     DEFAULT '' 0 '',
    `photos`             int                     DEFAULT '' 0 '',
    PRIMARY KEY (`id`),
    UNIQUE KEY `REL_060e11b7aa1f9f4040c8a5c53d` (`order_delivery_id`),
    UNIQUE KEY `REL_206c43363a3a9a895d1d419d33` (`payment_id`),
    KEY                  `FK_40eadba67cc475108f9062fe63c` (`customer_id`),
    KEY                  `FK_0e746ed8426500c052eb7ae946f` (`delivery_method_id`),
    KEY                  `FK_8a7c8fd5a1a997d18774b7f2b24` (`user_id`),
    KEY                  `FK_62d1bab8781e10fd590aab872ed` (`office_id`),
    CONSTRAINT `FK_060e11b7aa1f9f4040c8a5c53d0` FOREIGN KEY (`order_delivery_id`) REFERENCES `OrderDelivery` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_0e746ed8426500c052eb7ae946f` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_206c43363a3a9a895d1d419d330` FOREIGN KEY (`payment_id`) REFERENCES `Payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_40eadba67cc475108f9062fe63c` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_62d1bab8781e10fd590aab872ed` FOREIGN KEY (`office_id`) REFERENCES `Office` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_8a7c8fd5a1a997d18774b7f2b24` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OrderDelivery`
--

DROP TABLE IF EXISTS `OrderDelivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderDelivery`
(
    `id`                        int            NOT NULL AUTO_INCREMENT,
    `delivery_cost`             decimal(10, 0) NOT NULL,
    `deliveryState`             varchar(200) DEFAULT NULL,
    `deliveryMunicipality`      varchar(200) DEFAULT NULL,
    `tracking`                  varchar(200) DEFAULT NULL,
    `delivery_status`           varchar(200) DEFAULT NULL,
    `delivery_date`             datetime     DEFAULT NULL,
    `charge_on_delivery`        tinyint        NOT NULL,
    `delivery_type`             int          DEFAULT NULL,
    `updated_at`                datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `order_id`                  int          DEFAULT NULL,
    `deliveryLocality_id`       int          DEFAULT NULL,
    `delivery_current_locality` varchar(200) DEFAULT NULL,
    `sync`                      tinyint      DEFAULT '' 0 '',
    `delivery_status_date`      datetime     DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `REL_37e31f4a7282381dddb7e437fa` (`order_id`),
    KEY                         `FK_5be0a4e8aeed91a9d1048c7ac1a` (`deliveryLocality_id`),
    CONSTRAINT `FK_37e31f4a7282381dddb7e437fad` FOREIGN KEY (`order_id`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_5be0a4e8aeed91a9d1048c7ac1a` FOREIGN KEY (`deliveryLocality_id`) REFERENCES `DeliveryLocality` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OrderDetail`
--

DROP TABLE IF EXISTS `OrderDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderDetail`
(
    `id`              int            NOT NULL AUTO_INCREMENT,
    `color`           varchar(800)   DEFAULT NULL,
    `size`            varchar(100)   NOT NULL,
    `quantity`        int            NOT NULL,
    `price`           decimal(10, 0) NOT NULL,
    `cost`            decimal(10, 0) DEFAULT '' 0 '',
    `revenue`         decimal(10, 0) DEFAULT '' 0 '',
    `weight`          decimal(10, 0) DEFAULT '' 0 '',
    `discountPercent` decimal(10, 0) NOT NULL,
    `order_id`        int            DEFAULT NULL,
    `product_id`      int            DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY               `FK_b770c92e99e28d83c8aa72dba75` (`order_id`),
    KEY               `FK_8921c1dc9426c5e6d050dc56035` (`product_id`),
    CONSTRAINT `FK_8921c1dc9426c5e6d050dc56035` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`),
    CONSTRAINT `FK_b770c92e99e28d83c8aa72dba75` FOREIGN KEY (`order_id`) REFERENCES `Order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OrderHistoric`
--

DROP TABLE IF EXISTS `OrderHistoric`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderHistoric`
(
    `id`         int NOT NULL AUTO_INCREMENT,
    `user_id`    int      DEFAULT NULL,
    `status`     int      DEFAULT NULL,
    `created_at` datetime DEFAULT NULL,
    `order_id`   int      DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment`
(
    `id`                int            NOT NULL AUTO_INCREMENT,
    `name`              varchar(300)   NOT NULL,
    `phone`             varchar(30)    NOT NULL,
    `type`              varchar(255)   NOT NULL,
    `originBank`        varchar(255) DEFAULT NULL,
    `consignmentNumber` varchar(255)   NOT NULL,
    `consignmentAmount` decimal(10, 0) NOT NULL,
    `email`             varchar(255)   NOT NULL,
    `origen`            varchar(150) DEFAULT NULL,
    `created_at`        datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `user_id`           int          DEFAULT NULL,
    `targetBank`        varchar(255)   NOT NULL,
    `status`            int          DEFAULT '' 0 '',
    PRIMARY KEY (`id`),
    KEY                 `FK_ff087db6ed463b60a3e5a518f3f` (`user_id`),
    CONSTRAINT `FK_ff087db6ed463b60a3e5a518f3f` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product`
(
    `id`                 int            NOT NULL AUTO_INCREMENT,
    `reference`          varchar(20)    NOT NULL,
    `name`               varchar(255)   NOT NULL,
    `description`        varchar(800)            DEFAULT NULL,
    `material`           varchar(150)            DEFAULT NULL,
    `provider`           varchar(150)            DEFAULT NULL,
    `price`              decimal(10, 0) NOT NULL,
    `cost`               decimal(10, 0) NOT NULL,
    `discount`           decimal(10, 0)          DEFAULT '' 0 '',
    `weight`             decimal(10, 0) NOT NULL,
    `tags`               varchar(255)            DEFAULT NULL,
    `reference_key`      varchar(4)              DEFAULT NULL,
    `created_at`         datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`         datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `imagesQuantity`     int            NOT NULL DEFAULT '' 0 '',
    `published`          tinyint        NOT NULL DEFAULT '' 0 '',
    `status`             tinyint        NOT NULL,
    `category_id`        int                     DEFAULT NULL,
    `size_id`            int                     DEFAULT NULL,
    `provider_reference` varchar(12)             DEFAULT NULL,
    `size_description`   varchar(30)             DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_5b80d47fbfa9e551f33560a51a` (`reference`),
    KEY                  `FK_f9b5114e0cfa9a3c5bdf606aedb` (`category_id`),
    KEY                  `FK_2ac5de51b8c006a086346fe5555` (`size_id`),
    CONSTRAINT `FK_2ac5de51b8c006a086346fe5555` FOREIGN KEY (`size_id`) REFERENCES `Size` (`id`),
    CONSTRAINT `FK_f9b5114e0cfa9a3c5bdf606aedb` FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `ProductAvailableView`
--

DROP TABLE IF EXISTS `ProductAvailableView`;
/*!50001 DROP VIEW IF EXISTS `ProductAvailableView`*/;
SET
@saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `ProductAvailableView` AS SELECT
 1 AS `id`,
 1 AS `available`,
 1 AS `reserved`,
 1 AS `completed`*/;
SET
character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `ProductCatalogView`
--

DROP TABLE IF EXISTS `ProductCatalogView`;
/*!50001 DROP VIEW IF EXISTS `ProductCatalogView`*/;
SET
@saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `ProductCatalogView` AS SELECT
 1 AS `id`,
 1 AS `reference`,
 1 AS `name`,
 1 AS `description`,
 1 AS `material`,
 1 AS `provider`,
 1 AS `price`,
 1 AS `cost`,
 1 AS `discount`,
 1 AS `weight`,
 1 AS `tags`,
 1 AS `reference_key`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `imagesQuantity`,
 1 AS `published`,
 1 AS `status`,
 1 AS `category_id`,
 1 AS `size_id`,
 1 AS `provider_reference`,
 1 AS `first_image`,
 1 AS `second_image`,
 1 AS `price_discount`,
 1 AS `Quantity`*/;
SET
character_set_client = @saved_cs_client;

--
-- Table structure for table `ProductImage`
--

DROP TABLE IF EXISTS `ProductImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProductImage`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `group`      int          NOT NULL,
    `thumbs`     json         NOT NULL,
    `filename`   varchar(100) NOT NULL,
    `path`       varchar(300) NOT NULL,
    `product_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY          `FK_fd99f86cd68db2223add8702a08` (`product_id`),
    CONSTRAINT `FK_fd99f86cd68db2223add8702a08` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ProductSize`
--

DROP TABLE IF EXISTS `ProductSize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProductSize`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `name`       varchar(60)  NOT NULL,
    `color`      varchar(100) NOT NULL,
    `quantity`   int          NOT NULL,
    `product_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY          `FK_ff7200aac31bcdcc8deb4bae7c9` (`product_id`),
    CONSTRAINT `FK_ff7200aac31bcdcc8deb4bae7c9` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Size`
--

DROP TABLE IF EXISTS `Size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Size`
(
    `id`              int         NOT NULL AUTO_INCREMENT,
    `name`            varchar(60) NOT NULL,
    `sizes`           text        NOT NULL,
    `has_description` tinyint DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `State`
--

DROP TABLE IF EXISTS `State`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `State`
(
    `id`        int          NOT NULL AUTO_INCREMENT,
    `name`      varchar(100) NOT NULL,
    `dian_code` varchar(10)  NOT NULL,
    `iso_code`  varchar(5)   NOT NULL,
    `status`    tinyint      NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Template`
--

DROP TABLE IF EXISTS `Template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Template`
(
    `id`          int          NOT NULL AUTO_INCREMENT,
    `reference`   varchar(100) NOT NULL,
    `description` varchar(100) NOT NULL,
    `text`        text         NOT NULL,
    `status`      tinyint      NOT NULL,
    `created_at`  datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `has_editor`  tinyint DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_9965d514be97c0e94563ffcd4d` (`reference`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TemporalAddress`
--

DROP TABLE IF EXISTS `TemporalAddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TemporalAddress`
(
    `id`           int          NOT NULL AUTO_INCREMENT,
    `state`        varchar(255) NOT NULL,
    `municipality` varchar(255) NOT NULL,
    `customer_id`  int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY            `FK_77d05a186d671298d761153d895` (`customer_id`),
    CONSTRAINT `FK_77d05a186d671298d761153d895` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User`
(
    `id`               int          NOT NULL AUTO_INCREMENT,
    `name`             varchar(30)  NOT NULL,
    `lastname`         varchar(30)  NOT NULL,
    `photo`            text,
    `email`            varchar(300) DEFAULT NULL,
    `username`         varchar(45)  NOT NULL,
    `password`         varchar(300) NOT NULL,
    `salt`             varchar(300) NOT NULL,
    `status`           tinyint      NOT NULL,
    `last_login`       datetime     DEFAULT NULL,
    `created_at`       datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`       datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `security_role_id` int          DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations`
(
    `id`        int          NOT NULL AUTO_INCREMENT,
    `timestamp` bigint       NOT NULL,
    `name`      varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_history`
(
    `id`                 int            NOT NULL AUTO_INCREMENT,
    `origen`             varchar(150)            DEFAULT NULL,
    `total_amount`       decimal(10, 0) NOT NULL,
    `sub_total`          decimal(10, 0) NOT NULL,
    `total_discount`     decimal(10, 0)          DEFAULT '' 0 '',
    `total_revenue`      decimal(10, 0)          DEFAULT '' 0 '',
    `total_weight`       decimal(10, 0) NOT NULL,
    `enable_post_sale`   tinyint        NOT NULL DEFAULT '' 1 '',
    `remember`           tinyint                 DEFAULT NULL,
    `paymentMode`        int                     DEFAULT NULL,
    `pieces_for_changes` int                     DEFAULT NULL,
    `quantity`           int            NOT NULL,
    `expired_date`       datetime(6) DEFAULT CURRENT_TIMESTAMP (6),
    `date_of_sale`       datetime(6) DEFAULT CURRENT_TIMESTAMP (6),
    `created_at`         datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
    `updated_at`         datetime(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    `status`             int            NOT NULL,
    `originalID`         int            NOT NULL,
    `action`             enum('' CREATED '','' UPDATED '','' DELETED '') NOT NULL DEFAULT '' CREATED '',
    `customer_id`        int                     DEFAULT NULL,
    `delivery_method_id` int                     DEFAULT NULL,
    `user_id`            int                     DEFAULT NULL,
    `office_id`          int                     DEFAULT NULL,
    `order_delivery_id`  int                     DEFAULT NULL,
    `payment_id`         int                     DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `REL_0dff0420f1adad4d188f805eec` (`order_delivery_id`),
    UNIQUE KEY `REL_9717d6c08685d44909b2e87c16` (`payment_id`),
    KEY                  `FK_7ec8834ccf79631a801ab032f94` (`customer_id`),
    KEY                  `FK_0581b0220f83306210e33f12ff2` (`delivery_method_id`),
    KEY                  `FK_61871121875401d7807e617256b` (`user_id`),
    KEY                  `FK_241050d424c2c953c24a3bb5e6c` (`office_id`),
    CONSTRAINT `FK_0581b0220f83306210e33f12ff2` FOREIGN KEY (`delivery_method_id`) REFERENCES `DeliveryMethod` (`id`),
    CONSTRAINT `FK_0dff0420f1adad4d188f805eec9` FOREIGN KEY (`order_delivery_id`) REFERENCES `OrderDelivery` (`id`),
    CONSTRAINT `FK_241050d424c2c953c24a3bb5e6c` FOREIGN KEY (`office_id`) REFERENCES `Office` (`id`),
    CONSTRAINT `FK_61871121875401d7807e617256b` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`),
    CONSTRAINT `FK_7ec8834ccf79631a801ab032f94` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`id`),
    CONSTRAINT `FK_9717d6c08685d44909b2e87c162` FOREIGN KEY (`payment_id`) REFERENCES `Payment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `security_permission`
--

DROP TABLE IF EXISTS `security_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_permission`
(
    `id`          int          NOT NULL AUTO_INCREMENT,
    `permission`  varchar(100) NOT NULL,
    `description` varchar(300) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `security_rol`
--

DROP TABLE IF EXISTS `security_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_rol`
(
    `id`   int          NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `security_rol_permissions_security_permission`
--

DROP TABLE IF EXISTS `security_rol_permissions_security_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_rol_permissions_security_permission`
(
    `securityRolId`        int NOT NULL,
    `securityPermissionId` int NOT NULL,
    PRIMARY KEY (`securityRolId`, `securityPermissionId`),
    KEY                    `IDX_494ca42233847672fb433b27a2` (`securityRolId`),
    KEY                    `IDX_15c6abb347755a3c61f54d76eb` (`securityPermissionId`),
    CONSTRAINT `FK_15c6abb347755a3c61f54d76ebe` FOREIGN KEY (`securityPermissionId`) REFERENCES `security_permission` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_494ca42233847672fb433b27a2e` FOREIGN KEY (`securityRolId`) REFERENCES `security_rol` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `typeorm_metadata`
--

DROP TABLE IF EXISTS `typeorm_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typeorm_metadata`
(
    `type`     varchar(255) NOT NULL,
    `database` varchar(255) DEFAULT NULL,
    `schema`   varchar(255) DEFAULT NULL,
    `table`    varchar(255) DEFAULT NULL,
    `name`     varchar(255) DEFAULT NULL,
    `value`    text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `ProductAvailableView`
--

/*!50001 DROP VIEW IF EXISTS `ProductAvailableView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `ProductAvailableView` AS select `Product`.`id` AS `id`,(select sum(`ProductSize`.`quantity`) from `ProductSize` where (`ProductSize`.`product_id` = `Product`.`id`) group by `ProductSize`.`product_id`) AS `available`,(select sum(`OrderDetail`.`quantity`) AS `Reserved` from (`OrderDetail` join `Order` on((`OrderDetail`.`order_id` = `Order`.`id`))) where ((`Order`.`status` = 1) and (`OrderDetail`.`product_id` = `Product`.`id`)) group by `OrderDetail`.`product_id`) AS `reserved`,(select sum(`OrderDetail`.`quantity`) from ((`OrderDetail` join `Order` on((`OrderDetail`.`order_id` = `Order`.`id`))) join `OrderDelivery` on((`Order`.`order_delivery_id` = `OrderDelivery`.`id`))) where ((`Order`.`status` = 5) and (`OrderDetail`.`product_id` = `Product`.`id`) and (`OrderDelivery`.`delivery_type` = 1)) group by `OrderDetail`.`product_id`) AS `completed` from `Product` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `ProductCatalogView`
--

/*!50001 DROP VIEW IF EXISTS `ProductCatalogView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `ProductCatalogView` AS select `Product`.`id` AS `id`,`Product`.`reference` AS `reference`,`Product`.`name` AS `name`,`Product`.`description` AS `description`,`Product`.`material` AS `material`,`Product`.`provider` AS `provider`,`Product`.`price` AS `price`,`Product`.`cost` AS `cost`,`Product`.`discount` AS `discount`,`Product`.`weight` AS `weight`,`Product`.`tags` AS `tags`,`Product`.`reference_key` AS `reference_key`,`Product`.`created_at` AS `created_at`,`Product`.`updated_at` AS `updated_at`,`Product`.`imagesQuantity` AS `imagesQuantity`,`Product`.`published` AS `published`,`Product`.`status` AS `status`,`Product`.`category_id` AS `category_id`,`Product`.`size_id` AS `size_id`,`Product`.`provider_reference` AS `provider_reference`,(select `ProductImage`.`thumbs` from `ProductImage` where ((`ProductImage`.`product_id` = `Product`.`id`) and (`ProductImage`.`group` = 1)) limit 1) AS `first_image`,(select `ProductImage`.`thumbs` from `ProductImage` where ((`ProductImage`.`product_id` = `Product`.`id`) and (`ProductImage`.`group` = 2)) limit 1) AS `second_image`,(((`Product`.`price` * `Category`.`discount_percent`) / 100) + `Product`.`price`) AS `price_discount`,sum(`ProductSize`.`quantity`) AS `Quantity` from ((`ProductSize` join `Product` on((`Product`.`id` = `ProductSize`.`product_id`))) join `Category` on((`Category`.`id` = `Product`.`category_id`))) where ((`ProductSize`.`quantity` > 0) and (`Product`.`status` = 1)) group by `Product`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-02  1:20:56
