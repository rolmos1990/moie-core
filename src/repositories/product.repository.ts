import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Product} from "../models/Product";
import {Size} from "../models/Size";
import {InvalidArgumentException} from "../common/exceptions";

export class ProductRepository<T> extends BaseRepository<Product>{
    protected readonly repositoryManager : Repository<Product>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Product);
    }

    /**
     * Obtiene el código de referencia para un producto
     */
    async getNextReferenceCode(size: Size){
        const referenceKey = size.referenceKey || "";

        const product = await this.repositoryManager
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.size', 'size')
            .addSelect('LENGTH(p.reference)', 'lengthReference')
            .where({ size: size})
            .addOrderBy('LENGTH(reference)', 'DESC')
            .addOrderBy('reference', 'DESC').getOne();

        let nextReference = referenceKey + (size.startFrom + 1);

        if(product){
            const reference = product.reference;
            console.log("REFERENCE", reference);
            const sequence = parseInt(reference.replace(referenceKey, "").toString());
            console.log("SEQUENCE", sequence);
            const nextSequence = sequence + 1;
            console.log("NEXT SEQUENCE", nextSequence);
            nextReference = referenceKey + nextSequence;
            console.log("NEXT REFRENCE", nextReference);
        }
        return nextReference;
    }
}
