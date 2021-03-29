import {BaseService} from "../common/controllers/base.service";
import {Product} from "../models/Product";
import {ProductImageRepository} from "../repositories/productImage.repository";
import {decodeBase64Image, DecodeDataObj} from "../common/helper/helpers";
import {extension} from 'mime-types';
import {writeFileSync, readFileSync} from 'fs';
import {ProductImageCreate} from "../common/interfaces/Product";
import ResizeImg = require("resize-img");
//import fileStorage from 'file-storage';

export class ProductImageService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductImageRepository<Product>
    ){
        super(productRepository);
    }
    //TODO -- Cambios por hacer
    //Agregar un helper para el store, adicional a eso estandarizar los thumbs acorde a los formatos anteriores y nuevos.
    //Generar un Default Root -> para los diferentes adjuntos y almacenar la información enviada
    async addProductImages(filename, images: ProductImageCreate[]){
        images.forEach(async image => {
                const file = decodeBase64Image(image.file);
                if(file instanceof Error){
                    return false;
                }
                const ext = extension(file.type);
                const fileName =  "image." + ext;
                const fileThumbName =  "image_10." + ext;
                const imageBuffer = file.data;
                const filePath = "./uploads/" + fileName;
                const fileThumb = "./uploads/" + fileThumbName;
                writeFileSync(filePath, imageBuffer, 'utf8');
                const dataThumb = readFileSync(filePath);
                const thumb = await ResizeImg(dataThumb, {
                    width: 10,
                    height: 10
                });
                writeFileSync(fileThumb, thumb, 'utf8');
        });
        return true;
    }
}
