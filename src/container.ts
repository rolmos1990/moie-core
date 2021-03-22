import express = require('express');
import {createContainer, asClass} from "awilix";
import { scopePerRequest } from "awilix-express";
import { UserService } from "./services/user.service";
import {UserRepository} from './repositories/user.repository';
import {ClientService} from "./services/client.service";
import {DeliveryLocalityService} from "./services/deliveryLocality.service";
import {MunicipalityService} from "./services/municipality.service";
import {StateService} from "./services/state.service";
import {ClientRepository} from "./repositories/client.repository";
import {MunicipalityRepository} from "./repositories/municipality.repository";
import {StateRepository} from "./repositories/state.repository";
import {DeliveryLocalityRepository} from "./repositories/deliveryLocality.repository";
import {ProductRepository} from "./repositories/product.repository";
import {SizeRepository} from "./repositories/size.repository";
import {ProductService} from "./services/product.service";
import {SizeService} from "./services/size.service";
import {CategoryRepository} from "./repositories/category.repository";
import {CategoryService} from "./services/category.service";
import {ProductSizeService} from "./services/productSize.service";
import {ProductSizeRepository} from "./repositories/productSize.repository";

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
        // repositories
        userRepository: asClass(UserRepository).scoped(),
        clientRepository: asClass(ClientRepository).scoped(),
        deliveryLocalityRepository: asClass(DeliveryLocalityRepository).scoped(),
        municipalityRepository: asClass(MunicipalityRepository).scoped(),
        stateRepository: asClass(StateRepository).scoped(),
        sizeRepository: asClass(SizeRepository).scoped(),
        productRepository: asClass(ProductRepository).scoped(),
        categoryRepository: asClass(CategoryRepository).scoped(),
        productSizeRepository: asClass(ProductSizeRepository).scoped(),
        // services
        userService: asClass(UserService).scoped(),
        clientService: asClass(ClientService).scoped(),
        deliveryLocalityService: asClass(DeliveryLocalityService).scoped(),
        municipalityService: asClass(MunicipalityService).scoped(),
        stateService: asClass(StateService).scoped(),
        sizeService: asClass(SizeService).scoped(),
        productService: asClass(ProductService).scoped(),
        categoryService: asClass(CategoryService).scoped(),
        productSizeService: asClass(ProductSizeService).scoped(),
    });

    app.use(scopePerRequest(container));
};
