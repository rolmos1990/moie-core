import {BaseService} from "../common/controllers/base.service";
import {Template} from "../models/Template";
import {ApplicationException} from "../common/exceptions";
import {compile} from 'handlebars';
import {TemplateRepository} from "../repositories/template.repository";

export class TemplateService extends BaseService<Template> {
    constructor(
        private readonly templateRepository: TemplateRepository<Template>
    ){
        super(templateRepository);
    }

    /**
     * Obtener una plantilla determinada
     * @param templateName - Nombre de la Plantilla
     * @param dataObject - Objeto o Arreglo para interpolación en plantilla
     */
    async getTemplate(templateName, dataObject: Object){
        try {
            const template = await this.templateRepository.findOneByObject({reference: templateName});
            if(template){
                return compile(template.template)({...dataObject});
            } else {
                throw new ApplicationException("No se ha encontrado plantilla - " + templateName);
            }
        }catch(e){
            console.log("error generado", e.message);
            throw new ApplicationException("Ha ocurrido un problema con la plantilla - " + templateName);
        }
    }
}
