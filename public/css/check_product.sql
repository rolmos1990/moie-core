select producto.*,categoria.*,if(producto.descuento_especial > 0,CEIL(producto.precio*((100-producto.descuento_especial)/100)),CEIL(producto.precio*((100-categoria.descuento)/100))) as precio_descuento,CEIL(producto.precio*((100-categoria.descuento_mayor_1)/100)) as precio_descuento_mayor_1,producto.descuento_especial "
                    . "from producto inner join categoria on producto.id_categoria=categoria.id "
                    . "where id_categoria=$id_categoria and existencia>0 order by producto.orden asc
