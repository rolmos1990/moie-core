import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Product} from "../models/Product";
import {Size} from "../models/Size";
import {InvalidArgumentException} from "../common/exceptions";
import {FieldOption} from "../models/FieldOption";

export class ProductRepository<T> extends BaseRepository<Product>{
    protected readonly repositoryManager : Repository<Product>;
    protected readonly fieldOptionsRepositoryManager : Repository<FieldOption>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Product);
        this.fieldOptionsRepositoryManager = getRepository(FieldOption);
    }

    /**
     * Obtiene el código de referencia para un producto
     */
    async getNextReferenceCode(referenceKey: string){

        const fieldOptions = await this.fieldOptionsRepositoryManager.findOne({where: {
                group: 'REFERENCE_KEY',
                name: referenceKey
            }});

        if(!fieldOptions){
            throw new InvalidArgumentException(referenceKey + "No ha sido encontrada en el sistema");
        }

        const product = await this.repositoryManager
            .createQueryBuilder('p')
            .addSelect('LENGTH(p.reference)', 'lengthReference')
            .where({ referenceKey: referenceKey})
            .addOrderBy('LENGTH(reference)', 'DESC')
            .addOrderBy('reference', 'DESC').getOne();

        let nextReference =  referenceKey + ((fieldOptions.value) ? parseInt(fieldOptions.value['startFrom']) + 1 || 1 : 1);
        console.log("PRODUCT BEFORE", product);
        console.log("NEXT REFERENCE", nextReference);

        if(product){
            const reference = product.reference;
            console.log("REFERENCE", reference);
            const sequence = parseInt(reference.replace(referenceKey, "").toString());
            console.log("SEQUENCE", sequence);
            const nextSequence = sequence + 1;
            nextReference = referenceKey + nextSequence;
            console.log("NEXT REFERENCE", nextReference);
        }
        return nextReference;
    }
}
