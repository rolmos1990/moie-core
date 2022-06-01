import {Order} from "../../models/Order";
import {OrderProduct} from "../../controllers/parsers/orderProduct";
import {OrderDetail} from "../../models/OrderDetail";
import {InvalidArgumentException} from "../exceptions";
import {existsInEntity} from "./helpers";
import {ProductSize} from "../../models/ProductSize";
export const converterPhoneInColombianFormat = (phone) => {
    if(phone && phone.startsWith("+")){
        return phone;
    } else {
        return "+57" + (phone || "");
    }
}

export const converterFirstArrayObject = (array) => {
    if (Array.isArray(array)) {
        return array[0] || null;
    } else {
        return array;
    }
}

export const converterArrayToProductsObject = (productsArray) : OrderProduct[] => {
    const productRequest = productsArray.filter((v, i, a) => a.findIndex(t => (t.productSize === v.productSize)) === i);
    const newProducts: OrderProduct[] = productRequest.map(item => new OrderProduct(item));
    return newProducts;
}


export const converterPreOrderProductInOrderDetail = async (order: Order, products : OrderProduct[], productSizes: ProductSize[]) => {
    const orderDetails: OrderDetail[] = [];

    await Promise.all(products.map(async item => {
        const productSize = (productSizes.filter(_i => _i.id === item.productSize))[0];

        const orderDetail = new OrderDetail();
        orderDetail.color = productSize.color;
        orderDetail.cost = productSize.product.cost;
        orderDetail.discountPercent = item.discountPercentage;
        orderDetail.price = productSize.product.price || 0;
        orderDetail.quantity = item.quantity;
        orderDetail.revenue = productSize.product.price - productSize.product.cost;
        orderDetail.weight = productSize.product.weight;
        orderDetail.size = productSize.name;
        orderDetail.product = productSize.product;
        orderDetail.productSize = productSize;
        orderDetail.order = order;

        if (orderDetail.quantity <= 0) {
            throw new InvalidArgumentException("Verifique las cantidades para producto: " + productSize.product.reference + " (" + productSize.name + ")");
        }

        orderDetails.push(orderDetail);
    }));

    return orderDetails;
}
