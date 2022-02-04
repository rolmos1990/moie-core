CREATE TABLE `OrderHistoric` (
                                 `id` int(11) NOT NULL AUTO_INCREMENT,
                                 `user_id` int(11) DEFAULT NULL,
                                 `status` int(11) DEFAULT NULL,
                                 `created_at` datetime DEFAULT NULL,
                                 `order_id` int(11) DEFAULT NULL,
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8;
