CREATE VIEW `ProductCatalog` AS SELECT Product.*,
                                       (Product.price * Category.discount_percent / 100) + Product.price as price_discount,
                                       sum(ProductSize.quantity) as Quantity
                                FROM `moie-lucy-v2`.ProductSize inner join Product on Product.id = ProductSize.product_id inner join Category on Category.id = Product.category_id where ProductSize.quantity > 0 and Product.status = 1 group by Product.id;
