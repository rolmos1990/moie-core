import {BaseService} from "../common/controllers/base.service";
import {Product} from "../models/Product";
import {ProductImageRepository} from "../repositories/productImage.repository";
import {decodeBase64Image, DecodeDataObj} from "../common/helper/helpers";
import {extension} from 'mime-types';
import {writeFileSync, readFileSync} from 'fs';
import {ProductImageCreate} from "../common/interfaces/Product";
import ResizeImg = require("resize-img");
import {MediaManagementService} from "./mediaManagement.service";
import {ProductImage} from "../models/ProductImage";
import {InvalidArgumentException} from "../common/exceptions";
//import fileStorage from 'file-storage';

export class ProductImageService extends BaseService<Product> {
    constructor(
        private readonly productImageRepository: ProductImageRepository<Product>,
        private readonly mediaManagementService: MediaManagementService
    ){
        super(productImageRepository);
    }

    async addProductImages(product, group: number, filename, image){
        try {
            const productImageList = await this.productImageRepository.findByGroupAndProduct(product, group);
            const productImage = productImageList[0] || new ProductImage();


            const folder = product.category ? "/"+product.category : "";

            const allPaths = this.mediaManagementService.getImagePaths(folder, filename, image)
            if(allPaths) {
                const thumbs = {
                    small: allPaths.SMALL,
                    medium: allPaths.MEDIUM,
                    high: allPaths.HIGH
                };

                productImage.product = product;
                productImage.thumbs = JSON.stringify(thumbs);
                productImage.filename = allPaths.FILENAME;
                productImage.path = allPaths.ORIGINAL;
                productImage.group = group;

                await this.mediaManagementService.addImageFromBinary(folder, filename, image);
                await this.productImageRepository.save(productImage);
            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){
            throw new InvalidArgumentException();
        }
    }

    async removeProductImage(productImage: ProductImage){

        /** TODO -- REMPLAZAR ESTO POR QUE LAS IMAGENES NO GUARDEN TODO EL DIRECTORIO (SOLO GUARDEN EL NOMBRE DEL ARCHIVO) */

        const path = productImage.path.replace("./public", "../storage");
        const pathSmall = productImage.thumbs["small"] ? productImage.thumbs["small"].toString().replace("./public", "../storage") : null;
        const pathMedium = productImage.thumbs['medium'].replace("./public", "../storage");
        const pathHigh = productImage.thumbs['high'].replace("./public", "../storage");

        if(path) {
            await this.mediaManagementService.deleteFileFromPath(path);
        }
        if(pathSmall) {
            await this.mediaManagementService.deleteFileFromPath(pathSmall);
        }
        if(pathMedium) {
            await this.mediaManagementService.deleteFileFromPath(pathMedium);
        }
        if(pathHigh) {
            await this.mediaManagementService.deleteFileFromPath(pathHigh);
        }
    }
}
