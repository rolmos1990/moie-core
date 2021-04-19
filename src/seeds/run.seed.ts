import {CustomerSeed} from'./customer.seed';
import {Customer} from "../models/Customer";
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
import {FieldOption} from "../models/FieldOption";
import {FieldOptionsSeed} from "./fieldOptions.seed";

const convertToEntity = (entity, item) => {
    Object.keys(item).forEach(prop => {
        entity[prop] = item[prop];
    });
    return entity;
}

/**
 * Activa o desactiva los query que se quieran ejecutar
 */
const QUERY_IS_ACTIVE = {
    state: false,
    municipality: false,
    deliveryLocality: false,
    size: false,
    category: false,
    product: false,
    productSizes: false,
    customer: false,
    user: false,
    fieldOption: false
};

export class RunSeed {
    constructor(
    ) {
        if(QUERY_IS_ACTIVE.state) {
            console.log("CREATING STATE...");
            const state = getRepository(State);
            StateSeed.map(async item => {
                const entity = convertToEntity(new State(), item);
                await state.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.municipality) {
            console.log("CREATING MUNICIPALITY...");
            const municipality = getRepository(Municipality);
            MunicipalitySeed.map(async item => {
                const entity = convertToEntity(new Municipality(), item);
                await municipality.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.deliveryLocality) {
            console.log("CREATING LOCALITY...");
            //Delivery Locality
            const deliveryLocality = getRepository(DeliveryLocality);
            DeliveryLocalitySeed.map(async item => {
                const entity = convertToEntity(new DeliveryLocality(), item);
                await deliveryLocality.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.size) {
            console.log("CREATING SIZE...");
            //Size
            const size = getRepository(Size);
            SizeSeed.map(async item => {
                const entity = convertToEntity(new Size(), item);
                await size.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.category) {
            console.log("CREATING CATEGORY...");
            //Categories
            const category = getRepository(Category);
            CategorySeed.map(async item => {
                const entity = convertToEntity(new Category(), item);
                await category.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.product) {
            console.log("CREATING PRODUCTS...");
            //Products
            const product = getRepository(Product);
            ProductSeed.map(async item => {
                const entity = convertToEntity(new Product(), item);
                await product.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.productSizes) {
            console.log("CREATING PRODUCT SIZES...");
            //Product Sizes
            const productSizes = getRepository(ProductSize);
            ProductSizeSeed.map(async item => {
                const entity = convertToEntity(new ProductSize(), item);
                await productSizes.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.customer) {
            console.log("CREATING CUSTOMERS...");
            //Customers
            const customer = getRepository(Customer);
            CustomerSeed.map(async item => {
                const entity = convertToEntity(new Customer(), item);
                await customer.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.user) {
            console.log("CREATING USERS...");
            //User
            const user = getRepository(User);
            UserSeed.map(async item => {
                const entity = convertToEntity(new User(), item);
                await user.save(entity);
            });
        }

        if(QUERY_IS_ACTIVE.fieldOption) {
            console.log("CREATING FIELDOPTIONS...");
            //Fields Options
            const fieldOption = getRepository(FieldOption);
            FieldOptionsSeed.map(async item => {
                const entity = convertToEntity(new FieldOption(), item);
                await fieldOption.save(entity);
            });
        }
    };
}
