import express = require('express');
import { createContainer, asClass } from "awilix";
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

export default (app: express.Application): void => {
    const container = createContainer({
        injectionMode: 'CLASSIC'
    });

    container.register({
        // repositories
        userRepository: asClass(UserRepository).scoped(),
        clientRepository: asClass(ClientRepository).scoped(),
        deliveryLocalityRepository: asClass(DeliveryLocalityRepository).scoped(),
        municipalityRepository: asClass(MunicipalityRepository).scoped(),
        stateRepository: asClass(StateRepository).scoped(),

        // services
        userService: asClass(UserService).scoped(),
        clientService: asClass(ClientService).scoped(),
        deliveryLocalityService: asClass(DeliveryLocalityService).scoped(),
        municipalityService: asClass(MunicipalityService).scoped(),
        stateService: asClass(StateService).scoped(),
    });

    app.use(scopePerRequest(container));
};
