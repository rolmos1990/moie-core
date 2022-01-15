#!/bin/sh
# Workbench Table Data copy script
# Workbench Version: 8.0.27
# 
# Execute this to copy table data from a source RDBMS to MySQL.
# Edit the options below to customize it. You will need to provide passwords, at least.
# 
# Source DB: Mysql@44.192.20.154:3306 (MySQL)
# Target DB: Mysql@127.0.0.1:6603


# Source and target DB passwords
arg_source_password=
arg_target_password=
arg_source_ssh_password=
arg_target_ssh_password=

if [ -z "$arg_source_password" ] && [ -z "$arg_target_password" ] && [ -z "$arg_source_ssh_password" ] && [ -z "$arg_target_ssh_password" ] ; then
    echo WARNING: All source and target passwords are empty. You should edit this file to set them.
fi
arg_worker_count=2
# Uncomment the following options according to your needs

# Whether target tables should be truncated before copy
# arg_truncate_target=--truncate-target
# Enable debugging output
# arg_debug_output=--log-level=debug3

/Applications/MySQLWorkbench.app/Contents/MacOS/wbcopytables \
 --mysql-source="moie@44.192.20.154:3306" \
 --source-rdbms-type=Mysql \
 --target="root@127.0.0.1:6603" \
 --source-password="$arg_source_password" \
 --target-password="$arg_target_password" \
 --source-ssh-port="22" \
 --source-ssh-host="" \
 --source-ssh-user="" \
 --target-ssh-port="22" \
 --target-ssh-host="" \
 --target-ssh-user="" \
 --source-ssh-password="$arg_source_ssh_password" \
 --target-ssh-password="$arg_target_ssh_password" \
 --thread-count=$arg_worker_count \
 $arg_truncate_target \
 $arg_debug_output \
 --table '`moie-lucy`' '`adjunto`' '`moie-lucy`' '`adjunto`' '`id`' '`id`' '`id`, `id_movimiento`, `tipo`, `descripcion`' --table '`moie-lucy`' '`calendario`' '`moie-lucy`' '`calendario`' '`fecha`' '`fecha`' '`fecha`, `asignacion`' --table '`moie-lucy`' '`cliente`' '`moie-lucy`' '`cliente`' '`id`' '`id`' '`id`, `ci`, `nombre`, `seudonimo`, `direccion`, `ciudad`, `estado`, `telefono_movil`, `telefono_habitacion`, `email`, `fecha_registro`, `fecha_verificacion_email`, `id_municipio`, `edad`' --table '`moie-lucy`' '`clientes_devueltos`' '`moie-lucy`' '`clientes_devueltos`' '`id`' '`id`' '`nit`, `tipo`, `nombre`, `direccion`, `ciudad`, `telefono`, `municipio`, `activo`, `tiene_rut`, `pais`, `email`, `celular`, `plazo`, `actividad_economica`, `indicativo`, `naturaleza`, `id`' --table '`moie-lucy`' '`cuenta`' '`moie-lucy`' '`cuenta`' '`id`' '`id`' '`id`, `tipo`, `institucion`, `datos`, `habilitado`' --table '`moie-lucy`' '`desarrollo`' '`moie-lucy`' '`desarrollo`' '`id`' '`id`' '`id`, `descripcion`, `fecha_registro`, `fecha_culminacion`, `progreso`' --table '`moie-lucy`' '`despacho`' '`moie-lucy`' '`despacho`' '`id`' '`id`' '`id`, `fecha`, `tipo`, `metodo`, `descripcion`, `estatus`' --table '`moie-lucy`' '`email`' '`moie-lucy`' '`email`' '`id`' '`id`' '`id`, `direccion`, `asunto`, `contenido`, `fecha`, `enviado`' --table '`moie-lucy`' '`envio`' '`moie-lucy`' '`envio`' '`metodo`,`cantidad_minima`,`cantidad_maxima`' '`metodo`,`cantidad_minima`,`cantidad_maxima`' '`metodo`, `cantidad_minima`, `cantidad_maxima`, `monto_regional`, `monto_nacional`, `cobro_en_destino`' --table '`moie-lucy`' '`estado`' '`moie-lucy`' '`estado`' '`id`' '`id`' '`id`, `envio_regional`, `codigo_dian`, `codigo_iso`' --table '`moie-lucy`' '`existencia`' '`moie-lucy`' '`existencia`' '`id`' '`id`' '`id`, `id_producto`, `talla`, `color`, `cantidad`' --table '`moie-lucy`' '`factura`' '`moie-lucy`' '`factura`' '`id`' '`id`' '`id`, `id_venta`, `fecha`, `iva`, `id_resolucion_fe`, `num_legal`, `enviada`, `track_id`' --table '`moie-lucy`' '`historial`' '`moie-lucy`' '`historial`' '`id`' '`id`' '`id`, `objeto`, `id_objeto`, `accion`, `id_usuario`, `fecha`' --table '`moie-lucy`' '`inventario`' '`moie-lucy`' '`inventario`' '`id`' '`id`' '`id`, `tipo`, `descripcion`, `fecha`, `id_producto`' --table '`moie-lucy`' '`localidad`' '`moie-lucy`' '`localidad`' '`id`' '`id`' '`id`, `nombre`, `codigo_interrapidisimo`, `entrega`, `pago`, `primer_kilo`, `kilo_adicional`' --table '`moie-lucy`' '`medio_pago`' '`moie-lucy`' '`medio_pago`' '`id`' '`id`' '`id`, `tipo`, `descripcion`, `habilitado`' --table '`moie-lucy`' '`modificacion`' '`moie-lucy`' '`modificacion`' '`id_historial`,`campo`' '`id_historial`,`campo`' '`id_historial`, `campo`, `tipo`, `viejo_valor`, `nuevo_valor`' --table '`moie-lucy`' '`movimiento`' '`moie-lucy`' '`movimiento`' '`id`' '`id`' '`id`, `descripcion`, `monto`, `fecha`, `observacion`' --table '`moie-lucy`' '`movimiento_inventario`' '`moie-lucy`' '`movimiento_inventario`' '`id`' '`id`' '`id`, `color`, `talla`, `cantidad`, `id_inventario`' --table '`moie-lucy`' '`municipio`' '`moie-lucy`' '`municipio`' '`id`' '`id`' '`id`, `nombre`, `codigo_dian`, `id_estado`' --table '`moie-lucy`' '`nota_credito`' '`moie-lucy`' '`nota_credito`' '`id`' '`id`' '`id`, `id_factura`, `enviada`, `track_id`, `fecha`' --table '`moie-lucy`' '`nota_debito`' '`moie-lucy`' '`nota_debito`' '`id`' '`id`' '`id`, `id_factura`, `enviada`, `track_id`' --table '`moie-lucy`' '`observacion`' '`moie-lucy`' '`observacion`' '`id`' '`id`' '`id`, `contenido`, `id_usuario_origen`, `id_venta`, `fecha`' --table '`moie-lucy`' '`observacion_cliente`' '`moie-lucy`' '`observacion_cliente`' '`id`' '`id`' '`id`, `contenido`, `id_usuario_origen`, `id_cliente`, `fecha`' --table '`moie-lucy`' '`observacion_postventa`' '`moie-lucy`' '`observacion_postventa`' '`id`' '`id`' '`id`, `id_usuario`, `id_postventa`, `fecha`, `contenido`' --table '`moie-lucy`' '`observacion_usuario`' '`moie-lucy`' '`observacion_usuario`' '`id_observacion`,`id_usuario_destino`' '`id_observacion`,`id_usuario_destino`' '`id_observacion`, `id_usuario_destino`' --table '`moie-lucy`' '`opcion`' '`moie-lucy`' '`opcion`' '`objeto`,`campo`,`valor`' '`objeto`,`campo`,`valor`' '`objeto`, `campo`, `valor`' --table '`moie-lucy`' '`pago`' '`moie-lucy`' '`pago`' '`id`' '`id`' '`id`, `id_venta`, `nombre`, `telefono`, `forma`, `banco`, `numero`, `monto`, `fechahora`, `email`, `origen`' --table '`moie-lucy`' '`pedidos_devueltos`' '`moie-lucy`' '`pedidos_devueltos`' '`id`' '`id`' '`cuenta`, `comprobante`, `fecha`, `documento`, `documento_ref`, `nit`, `detalle`, `tipo`, `valor`, `base`, `centro_costo`, `transf_ext`, `plazo`, `detalles`, `estatus`, `id`' --table '`moie-lucy`' '`permiso`' '`moie-lucy`' '`permiso`' '`modulo`,`accion`' '`modulo`,`accion`' '`modulo`, `accion`' --table '`moie-lucy`' '`postventa`' '`moie-lucy`' '`postventa`' '`id`' '`id`' '`id`, `id_venta`, `id_payu`, `rastreo`, `fecha_envio`, `activo`, `estatus_envio`, `fecha_estatus_envio`, `ubicacion_estatus_envio`, `fecha_rastreo`, `metodo_envio`' --table '`moie-lucy`' '`producto`' '`moie-lucy`' '`producto`' '`id`' '`id`' '`id`, `descripcion`, `marca`, `tipo`, `material`, `proveedor`, `precio`, `costo`, `id_talla`, `fecha`, `sirve_para`, `peso`' --table '`moie-lucy`' '`resolucion`' '`moie-lucy`' '`resolucion`' '`id`' '`id`' '`id`, `numero`, `fecha`, `inicio`, `fin`' --table '`moie-lucy`' '`resolucion_fe`' '`moie-lucy`' '`resolucion_fe`' '`id`' '`id`' '`id`, `numero`, `inicio`, `fin`, `prefijo`, `fecha`, `activa`' --table '`moie-lucy`' '`rol`' '`moie-lucy`' '`rol`' '`id`' '`id`' '`id`, `descripcion`' --table '`moie-lucy`' '`rol_permiso`' '`moie-lucy`' '`rol_permiso`' '`id_rol`,`modulo_permiso`,`accion_permiso`' '`id_rol`,`modulo_permiso`,`accion_permiso`' '`id_rol`, `modulo_permiso`, `accion_permiso`' --table '`moie-lucy`' '`sms`' '`moie-lucy`' '`sms`' '`id`' '`id`' '`id`, `numero`, `contenido`, `prioridad`, `fecha`, `enviado`' --table '`moie-lucy`' '`t2`' '`moie-lucy`' '`t2`' '`id`' '`id`' '`id`, `objeto`, `id_objeto`, `accion`, `id_usuario`, `fecha`' --table '`moie-lucy`' '`talla`' '`moie-lucy`' '`talla`' '`id`' '`id`' '`id`, `descripcion`, `tallas`' --table '`moie-lucy`' '`usuario`' '`moie-lucy`' '`usuario`' '`id`' '`id`' '`id`, `nombre`, `password`, `telefono`, `intentos_fallidos`' --table '`moie-lucy`' '`usuario_rol`' '`moie-lucy`' '`usuario_rol`' '`id_usuario`,`id_rol`' '`id_usuario`,`id_rol`' '`id_usuario`, `id_rol`' --table '`moie-lucy`' '`venta`' '`moie-lucy`' '`venta`' '`id`' '`id`' '`id`, `id_cliente`, `iva`, `id_usuario`, `metodo_envio`, `monto_envio`, `cobro_en_destino`, `origen`, `estatus`, `fecha_generacion`, `fecha_entrega`, `fecha_venta`, `fecha_expiracion`, `rastreo`, `recordatorio`, `impresiones`, `tipo`, `confirmacion`, `fecha_creacion`, `id_despacho`, `forma_pago`, `piezas_cambio`, `id_localidad`' --table '`moie-lucy`' '`venta_producto`' '`moie-lucy`' '`venta_producto`' '`id`' '`id`' '`id`, `id_venta`, `id_producto`, `color`, `talla`, `cantidad`, `precio`, `costo`, `ajuste`'

