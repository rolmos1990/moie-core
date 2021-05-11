-- Vista para mostrar productos disponibles relacionado a productos
-- Verificar si los estados vendidos serian 4,5 (Enviado, Conciliado) o tambien seria confirmados.

SELECT product_id ,
(Select SUM(quantity) from ProductSize where product_id = `OrderDetail`.product_id group by ProductSize.product_id) as available,
(Select SUM(OrderDetail.quantity) as Reserved from OrderDetail inner join `Order` on OrderDetail.order_id = `Order`.id
where `Order`.status = 1 group by OrderDetail.product_id) as reserved,
(Select SUM(OrderDetail.quantity) from OrderDetail inner join `Order` on OrderDetail.order_id = `Order`.id where `Order`.status IN (4,5)
group by OrderDetail.product_id) as completed
from OrderDetail group by OrderDetail.product_id;
