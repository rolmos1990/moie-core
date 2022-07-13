import {ClientSeed} from'./client.seed';
import {Customer} from "../models/Client";
import {getRepository} from "typeorm";
import {State} from "../models/State";
import {StateSeed} from "./state.seed";
import {MunicipalitySeed} from "./municipality.seed";
import {Municipality} from "../models/Municipality";
import {SizeSeed} from "./size.seed";
import {Product} from "../models/Product";
import {ProductSeed} from "./product.seed";
import {DeliveryLocality} from "../models/DeliveryLocality";
import {DeliveryLocalitySeed} from "./deliveryLocality.seed";
import {ProductSize} from "../models/ProductSize";
import {ProductSizeSeed} from "./productSize.seed";
import {User} from "../models/User";
import {Category} from "../models/Category";
import {CategorySeed} from "./category.seed";
import {UserSeed} from "./user.seed";
import {Size} from "../models/Size";

const convertToEntity = (entity, item) => {
    Object.keys(item).forEach(prop => {
        entity[prop] = item[prop];
    });
    return entity;
}
export class RunSeed {
    constructor(
    ) {
        //States
        console.log("STARTING MIGRATION...");

        console.log("CREATING STATES...");
        const state = getRepository(State);
        StateSeed.map(async item => {
            const entity = convertToEntity(new State(), item);
            await state.save(entity);
        });

        console.log("CREATING MUNICIPALITY...");
        //Municipality
        const municipality = getRepository(Municipality);
        MunicipalitySeed.map(async item => {
            const entity = convertToEntity(new Municipality(), item);
            await municipality.save(entity);
        });

        console.log("CREATING LOCALITY...");
        //Delivery Locality
        const deliveryLocality = getRepository(DeliveryLocality);
        DeliveryLocalitySeed.map(async item => {
            const entity = convertToEntity(new DeliveryLocality(), item);
            await deliveryLocality.save(entity);
        });

        console.log("CREATING SIZE...");
        //Size
        const size = getRepository(Size);
        SizeSeed.map(async item => {
            const entity = convertToEntity(new Size(), item);
            await size.save(entity);
        });

        console.log("CREATING CATEGORY...");
        //Categories
        const category = getRepository(Category);
        CategorySeed.map(async item => {
            const entity = convertToEntity(new Category(), item);
            await category.save(entity);
        });

        console.log("CREATING PRODUCTS...");
        //Products
        const product = getRepository(Product);
        ProductSeed.map(async item => {
            const entity = convertToEntity(new Product(), item);
            await product.save(entity);
        });

        console.log("CREATING PRODUCT SIZES...");
        //Product Sizes
        const productSizes = getRepository(ProductSize);
        ProductSizeSeed.map(async item => {
            const entity = convertToEntity(new ProductSize(), item);
            await productSizes.save(entity);
        });

        console.log("CREATING CLIENTS...");
        //Clients
        const customer = getRepository(Customer);
        ClientSeed.map(async item => {
            const entity = convertToEntity(new Customer(), item);
            await customer.save(entity);
        });

        console.log("CREATING USERS...");
        //User
        const user = getRepository(User);
        UserSeed.map(async item => {
            const entity = convertToEntity(new User(), item);
            await user.save(entity);
        });
    };
}
