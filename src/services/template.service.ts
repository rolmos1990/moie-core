import {BaseService} from "../common/controllers/base.service";
import {Template} from "../models/Template";
import {ApplicationException} from "../common/exceptions";
import {compile, registerHelper, registerPartial} from 'handlebars';
import {TemplateRepository} from "../repositories/template.repository";
import {OfficePDFCss, PrintHeaderCss} from "../templates/styles/catalogHeader";
import {CatalogHeaderCss} from "../templates/styles/catalogHeaderCss";
const moment = require("moment");

export class TemplateService extends BaseService<Template> {
    constructor(
        private readonly templateRepository: TemplateRepository<Template>
    ){
        super(templateRepository);
        this.helpersForTpl(); //Initialize helpers for tpl
    }

    helpersForTpl(){

        //Custom Date Format
        registerHelper('currency', function currencyFormat(number){
            if(!number){
                return "";
            }
            const numberFormat = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
            return numberFormat.format(number)
        });

        registerHelper('incrementDiscount', function (product, discount){
            if(!product){
                return "";
            } else if(discount <= 0){
                const numberFormat = new Intl.NumberFormat('es-CO', {minimumFractionDigits: 2});
                return numberFormat.format(Number(product.price));
            } else {
                const newPrice = (Number(product.price) * (discount || 0) / 100) + Number(product.price);
                const numberFormat = new Intl.NumberFormat('es-CO', {minimumFractionDigits: 2});
                return numberFormat.format(newPrice);
            }
        });

        registerHelper('scurrency', function currencyFormat(number){
            if(!number){
                return "";
            }
            const numberFormat = new Intl.NumberFormat('es-CO', {minimumFractionDigits: 2});
            return numberFormat.format(number)
        });

        //Custom dateFormat
        registerHelper('dateFormat', function (date, options) {
            const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY"
            return moment(date).format(formatToUse);
        });

        //Border Number
        registerHelper('borderNumber', function (borderNumber) {
            if((parseInt(borderNumber) % 4) >= 2){
                return "top";
            } else {
                return "bottom";
            }
        });

        //Border Number
        registerHelper('borderNumber', function (borderNumber) {
            if((parseInt(borderNumber) % 4) >= 2){
                return "top";
            } else {
                return "bottom";
            }
        });

        registerHelper('normalizeWeight', function (weight) {
            if(weight < 1000){
                return Number(weight);
            } else {
                return Math.floor(Number(weight));
            }
        });

        //Use comparatives in template
        registerHelper('ifCond', function (v1, operator, v2, options) {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });

        /** ############################ */
        /** Puede registrar aqui parciales que son plantillas usadas en el templates */
        /** Register Styles for can be used on templates */

        /** registerPartial(partialName, styleHTML) */

        registerPartial('printHeader', PrintHeaderCss);
        registerPartial('catalogHeader', CatalogHeaderCss);
        registerPartial('officePdf', OfficePDFCss);
        /** Fin de Registro de Parciales */
        /** ############################ */

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
