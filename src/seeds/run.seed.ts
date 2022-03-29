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
import {Template} from "../models/Template";
import {TemplateSeed} from "./template.seed";
import {SecurityPermission} from "../models/SecurityPermission";
import {PermissionSeed} from './permission.seed';

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
    fieldOption: false,
    template: false,
    permission: false
};

export class RunSeed {
    constructor(
    ) {
        let updated = 0;
        if(QUERY_IS_ACTIVE.state) {
            const state = getRepository(State);
            StateSeed.map(async item => {
                const entity = convertToEntity(new State(), item);
                await state.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.municipality) {
            const municipality = getRepository(Municipality);
            MunicipalitySeed.map(async item => {
                const entity = convertToEntity(new Municipality(), item);
                await municipality.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.deliveryLocality) {
            console.log("SEED -- CREATING LOCALITY...");
            //Delivery Locality
            const deliveryLocality = getRepository(DeliveryLocality);
            DeliveryLocalitySeed.map(async item => {
                const entity = convertToEntity(new DeliveryLocality(), item);
                await deliveryLocality.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.size) {
            console.log("SEED -- CREATING SIZE...");
            //Size
            const size = getRepository(Size);
            SizeSeed.map(async item => {
                const entity = convertToEntity(new Size(), item);
                await size.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.category) {
            console.log("SEED - CREATING CATEGORY...");
            //Categories
            const category = getRepository(Category);
            CategorySeed.map(async item => {
                const entity = convertToEntity(new Category(), item);
                await category.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.product) {
            console.log("SEED - CREATING PRODUCTS...");
            //Products
            const product = getRepository(Product);
            ProductSeed.map(async item => {
                const entity = convertToEntity(new Product(), item);
                await product.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.productSizes) {
            console.log("SEED - CREATING PRODUCT SIZES...");
            //Product Sizes
            const productSizes = getRepository(ProductSize);
            ProductSizeSeed.map(async item => {
                const entity = convertToEntity(new ProductSize(), item);
                await productSizes.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.customer) {
            console.log("CREATING CUSTOMERS...");
            //Customers
            const customer = getRepository(Customer);
            CustomerSeed.map(async item => {
                const entity = convertToEntity(new Customer(), item);
                await customer.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.user) {
            console.log("CREATING USERS...");
            //User
            const user = getRepository(User);
            UserSeed.map(async item => {
                const entity = convertToEntity(new User(), item);
                await user.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.fieldOption) {
            console.log("CREATING FIELDOPTIONS...");
            //Fields Options
            const fieldOption = getRepository(FieldOption);
            FieldOptionsSeed.map(async item => {
                const entity = convertToEntity(new FieldOption(), item);
                await fieldOption.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.template) {
            console.log("CREATING TEMPLATES...");
            //Fields Options
            const fieldOption = getRepository(Template);
            TemplateSeed.map(async item => {
                const entity = convertToEntity(new Template(), item);
                await fieldOption.save(entity);
            });
            updated++;
        }

        if(QUERY_IS_ACTIVE.permission) {
            console.log("CREATING PERMISSIONS...");
            //Fields Options
            const fieldOption = getRepository(SecurityPermission);
            PermissionSeed.map(async item => {
                const entity = convertToEntity(new SecurityPermission(), item);
                await fieldOption.save(entity);
            });
            updated++;
        }

        if(updated > 0) {
            console.log("TOTAL SEED UPDATES -- ", updated);
            console.log("*** END -- SEED RUNNING ****");
        }
    };
}
