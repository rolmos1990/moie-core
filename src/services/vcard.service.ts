import {BaseService} from "../common/controllers/base.service";
import {VCard} from "../models/VCard";
import {VCardRepository} from "../repositories/vcard.repository";
import {CustomerRepository} from "../repositories/customer.repository";
import {Customer} from "../models/Customer";
import {getRepository} from "typeorm";

export class VCardService extends BaseService<VCard> {
    constructor(
        private readonly vcardRepository: VCardRepository<VCard>,
        private readonly customerRepository: CustomerRepository<Customer>
    ){
        super(vcardRepository);
    }

    public async buildVCard(initial: number, date: any, phones: []){
        let started = initial;
        if(phones.length > 0){

            const customers = await this.customerRepository.createQueryBuilder('c')
                .where(`REPLACE(c.cellphone, '+57', '') IN (:...phones)`, { phones })
                .orWhere(`CONCAT('+57', c.cellphone) IN (:...phones)`, { phones })
                .getMany();

            const vCard : Array<VCard> = [];
            phones.forEach(_phone => {
                let info = new VCard;
               const _customer = customers.filter(customer => [_phone, '+57' + _phone].includes(customer.cellphone));
               if(_customer.length > 0){
                   info.name = date + ' (C) ' + _customer[0].name + ' ' + started;
                   info.phone = _phone;
                   info.createdAt = new Date();
               } else {
                   info.name = date + ' (PC) ' + started;
                   info.phone = _phone;
                   info.createdAt = new Date();
               }
                started++;
               vCard.push(info);
            });

            return vCard;
        }
    }
}
