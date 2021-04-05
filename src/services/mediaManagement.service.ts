import {decodeBase64Image} from "../common/helper/helpers";
import {readFileSync, writeFile, writeFileSync} from "fs";
import {UtilService} from "../common/controllers/util.service";
import {extension} from 'mime-types';
import ResizeImg = require("resize-img");

const CONFIG_MEDIA = {
    IMAGE_PATH: './uploads',
    RESOLUTIONS: [67,238,400,800]
};

/**
 * Servicio para administración de contenido, imagenes, adjuntos etc.
 */
export class MediaManagementService extends UtilService {

    getImagePaths(folder = "", name, _file){

        const file = decodeBase64Image(_file);

        if(file instanceof Error){
            return false;
        }

        const ext = extension(file.type);
        const fileName =  `${name}_800.${ext}`;
        const filePath = CONFIG_MEDIA.IMAGE_PATH + "/" + folder + fileName;

        const thumbs : any[] = [];

        const mediaConfig = {
            67: 'SMALL',
            238: 'MEDIUM',
            400: 'HIGHT',
            800: 'ORIGINAL'
        };

        let response = {
            ORIGINAL: filePath,
            SMALL: null,
            MEDIUM: null,
            HIGHT: null,
            FILENAME: fileName
        };

        CONFIG_MEDIA.RESOLUTIONS.map(async item => {
            const fileResizedName =  `${name}_${item}.${ext}`;
            const fileResized = CONFIG_MEDIA.IMAGE_PATH + folder + "/" + fileResizedName;
            response[mediaConfig[item]] = fileResized;
        });

        return response;
    }

    /**
     *
     * @param folder = /var/example
     * @param name fileName
     * @param _file binaryFile
     */
    async addImageFromBinary(folder = "", name, _file){
        const file = decodeBase64Image(_file);

        if(file instanceof Error){
            return false;
        }

        /**
         * Saving original image
         */
        const ext = extension(file.type);
        const fileName =  `${name}.${ext}`;
        const imageBuffer = file.data;
        const filePath = CONFIG_MEDIA.IMAGE_PATH + "/" + folder + fileName;
        writeFileSync(filePath, imageBuffer, 'utf8');

        const fileSaved = readFileSync(filePath);

        const thumbs : any[] = [];
        const resolved = CONFIG_MEDIA.RESOLUTIONS.map(async item => {
            const resized = await ResizeImg(fileSaved, {
                width: item,
            });
            const fileResizedName =  `${name}_${item}.${ext}`;
            const filename_resized = CONFIG_MEDIA.IMAGE_PATH + folder + "/" + fileResizedName;
            thumbs.push({ filename_resized, buffer: resized });
        });

        await Promise.all(resolved);

        const saved = thumbs.map(async item => {
            await writeFile(item.filename_resized, item.buffer, () => {});
        });

        await Promise.all(saved);
    }
}
