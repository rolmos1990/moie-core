-- Crear referencia en el producto
UPDATE Product set reference_key = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(reference, '9', ''), '8', ''), '7', ''),'6',''),'5',''),'4',''),'3',''),'2',''),'1',''),'0','')
