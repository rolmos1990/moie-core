import express = require('express');
import {createContainer, asClass} from "awilix";
import { scopePerRequest } from "awilix-express";
import {CategoryService} from "./services/category.service";
import {app} from "./app";
import {ProductService} from "./services/product.service";

export default (app: express.Application): void => {
    const container = createContainer({
        injectionMode: 'CLASSIC'
    });

    //TODO -- cargar por lotes
/*    container.loadModules(['services/!*.ts', 'repositories/!*.ts'], {
        // we want `TodosService` to be registered as `todosService`.
        formatName: 'camelCase',
        resolverOptions: {
            // We want instances to be scoped to the Koa request.
            // We need to set that up.
            lifetime: Lifetime.SCOPED
        }
    });*/


    container.register({
        // Servicios de Migración
        categoryService: asClass(CategoryService).scoped(),
        productService: asClass(ProductService).scoped(),

    });

    app.use(scopePerRequest(container));
};
