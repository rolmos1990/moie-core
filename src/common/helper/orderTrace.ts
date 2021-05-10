import {OrderDetail} from "../../models/OrderDetail";
import {existsInEntity} from "./helpers";

export class OrderProductTrace {
    constructor(oldProductDetail: OrderDetail[], newProductDetail: OrderDetail[]){
        this.oldProducts = oldProductDetail;
        this.newProducts = newProductDetail;
    }

    /** Cambios de productos */
    private oldProducts : OrderDetail[] = [];
    private newProducts : OrderDetail[] = [];

    /** Traza de productos: Agregados, Actualizados, Eliminados */
    private deleted : OrderDetail[] = [];
    private updated : any = [];
    private added : OrderDetail[] = [];

    /** Obtener ordenamiento de productos */
    process() {
        /** Obtener productos a agregar */
        /** Old {name: 1, name: 2, name: 3}, {name: 2} */
        /** Old {name: 1} -> New {} */
        this.newProducts.map(item_new => {
            const oldProduct = existsInEntity(this.oldProducts, item_new);
            if(!oldProduct.exists){
                //nuevos
                this.added.push(item_new);
            } else {
                //actualizados
                const orderDetail : OrderDetail = item_new;
                orderDetail.product = oldProduct.value.product;
                this.updated.push({diff: oldProduct.value.quantity - item_new.quantity, orderDetail: orderDetail});
            }
        });

        /** Obtener productos a eliminar */
        this.oldProducts.map(item_old => {
            const newProduct = existsInEntity(this.newProducts, item_old);
            if(!newProduct.exists){
                //se elimina
                this.deleted.push(item_old);
            }
        });

    }

    getBatches(){
        return {
            deleted: this.deleted,
            updated: this.updated,
            added: this.added
        }
    }
}
