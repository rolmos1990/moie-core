import express = require('express');
import {createContainer, asClass} from "awilix";
import { scopePerRequest } from "awilix-express";
import {CategoryService} from "./services/category.service";
import {ProductService} from "./services/product.service";
import {SizeService} from "./services/size.service";
import {ProductSizeService} from "./services/productSize.service";
import {DeliveryLocalityService} from "./services/deliveryLocality.service";
import {StateService} from "./services/state.service";
import {MunicipalityService} from "./services/municipality.service";
import {ClientService} from "./services/client.service";

export default (app: express.Application): void => {
    const container = createContainer({
        injectionMode: 'CLASSIC'
    });

    container.register({
        // Servicios de Migración
        categoryService: asClass(CategoryService).scoped(),
        productService: asClass(ProductService).scoped(),
        sizeService: asClass(SizeService).scoped(),
        productSizeService: asClass(ProductSizeService).scoped(),
        deliveryLocalityService: asClass(DeliveryLocalityService).scoped(),
        stateService: asClass(StateService).scoped(),
        municipalityService: asClass(MunicipalityService).scoped(),
        clientService: asClass(ClientService).scoped(),

    });

    app.use(scopePerRequest(container));
};
