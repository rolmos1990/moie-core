const PermissionBasicTplSeed = [
    {
        permission: "product",
        description: "Productos"
    },
    {
        permission: "category",
        description: "Categorias"
    },
    {
        permission: "customer",
        description: "Clientes"
    },
    {
        permission: "order",
        description: "Ordenes"
    },
    {
        permission: "office",
        description: "Despachos"
    },
    {
        permission: "bill",
        description: "Facturas"
    },
    {
        permission: "postsale",
        description: "PostVenta"
    },
    {
        permission: "payment",
        description: "Pagos"
    },
    {
        permission: "report",
        description: "Reportes"
    },
    {
        permission: "user",
        description: "Usuarios"
    },
    {
        permission: "security",
        description: "Seguridad"
    },
    {
        permission: "locality",
        description: "Localidades"
    },
    {
        permission: "template",
        description: "Plantillas"
    },
    {
        permission: "resolution",
        description: "Resoluciones"
    },
    {
        permission: "config",
        description: "Configuraciones"
    },
    {
        permission: "comment",
        description: "Observaciones"
    },
];

let counter = 0;
let PermissionBasicSeed = [];

PermissionBasicTplSeed.map((item) => {
    return  ["create", "edit", "show", "list"].map(o =>
        {
            const added = {
                id: ++counter,
                permission: item.permission + "." + o,
                description: o.toUpperCase() + " " + item.description
            }

            PermissionBasicSeed.push(added);

            return added;
        }
    );

});


PermissionBasicSeed.push({
    id: ++counter,
    permission: "order.personal",
    description: "Filtrar solo mis ordenes"
});

PermissionBasicSeed.push({
    id: ++counter,
    permission: "office.download",
    description: "Descargas en despachos"
});

PermissionBasicSeed.push({
    id: ++counter,
    permission: "bill.download",
    description: "Descargas en Factura"
});

PermissionBasicSeed.push({
    id: ++counter,
    permission: "postsale.download",
    description: "Descargas en PostVenta"
});

console.log("PERMISSIONS", PermissionBasicSeed);


export const PermissionSeed = PermissionBasicSeed;



