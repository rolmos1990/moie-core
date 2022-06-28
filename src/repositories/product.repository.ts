import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Product} from "../models/Product";
import {Size} from "../models/Size";
import {InvalidArgumentException} from "../common/exceptions";
import {FieldOption} from "../models/FieldOption";
import {FIELD_OPTIONS} from "../common/enum/fieldOptions";
import {Category} from "../models/Category";

export class ProductRepository<T> extends BaseRepository<Product>{
    protected readonly repositoryManager : Repository<Product>;
    protected readonly fieldOptionsRepositoryManager : Repository<FieldOption>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Product);
        this.fieldOptionsRepositoryManager = getRepository(FieldOption);
    }

    async getNextOrderFromCategory(category: Category){

        const product = await this.repositoryManager
            .createQueryBuilder('p')
            .where({ category: category})
            .addOrderBy('orden', 'DESC').getOne();
        if(product){
            const _orden = product.orden;
            return _orden + 1;
        }

        return 1;
    }

    /**
     * Obtiene el código de referencia para un producto
     */
    async getNextReferenceCode(referenceKey: string){

        const fieldOptions = await this.fieldOptionsRepositoryManager.findOne({where: {
                groups: FIELD_OPTIONS.REFERENCE_KEY,
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

        if(product){
            const reference = product.reference;
            const sequence = parseInt(reference.replace(referenceKey, "").toString());
            const nextSequence = sequence + 1;
            nextReference = referenceKey + nextSequence;
        }
        return nextReference;
    }
}
