import {decodeBase64Image} from "../common/helper/helpers";
import {readFileSync, writeFile, writeFileSync, existsSync, mkdirSync} from "fs";
import {UtilService} from "../common/controllers/util.service";
import {extension} from 'mime-types';
import ResizeImg = require("resize-img");
import {compile, Exception} from 'handlebars';
import * as path from "path";
import {create} from 'handlebars-pdf';
import {Worksheet} from "exceljs";
import {InvalidFileException} from "../common/exceptions";
const createHTML = require('create-html');
const Excel = require('exceljs')
import moment = require("moment");

const html_to_pdf = require('html-pdf-node');


export const CONFIG_MEDIA = {
    IMAGE_PATH: '/uploads',
    PDF_PATH: '/pdf',
    STORAGE_PATH: './storage/uploads',
    STORAGE_PDF_PATH: './storage/pdf',
    PICTURES_FOLDERS: '/users',
    RESOLUTIONS: [67,238,400,800]
};

export const MEDIA_FORMAT_OUTPUT = {
    b64: 'b64',
    binary: 'binary',
    b64storage: 'b64storage'
};

type ImageResource = {
    filename: string,
    data: string,
    fullpath: string,
    fullepath_v: string
};

/**
 * Servicio para administración de contenido, imagenes, adjuntos etc.
 */
export class MediaManagementService extends UtilService {

    ensureDirectoryExistence(filePath) {
        const dirname = path.dirname(filePath);
        if (existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        mkdirSync(dirname);
    }

    createImageFile(folder = "", name, _file) : ImageResource {

        const file = decodeBase64Image(_file);

        if(file instanceof Error){
            throw  new InvalidFileException("No es posible realizar el guardado de la imagen");
        }

        const ext = extension(file.type);
        const fileName =  `${name}.${ext}`;
        const writeFilePath = `${CONFIG_MEDIA.STORAGE_PATH}/${folder ? folder + '/' : ''}${fileName}`;
        const readFilePath = `${CONFIG_MEDIA.IMAGE_PATH}${folder ? folder + '/' : ''}${fileName}`;
        const imageBuffer = file.data;

        this.ensureDirectoryExistence(writeFilePath);
        writeFileSync(writeFilePath, imageBuffer, 'utf8');

        return {
            fullpath: readFilePath,
            fullepath_v: readFilePath + "?v=" + moment().format("x"),
            filename: fileName,
            data: imageBuffer};
    }

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
            400: 'HIGH',
            800: 'ORIGINAL'
        };

        let response = {
            ORIGINAL: filePath,
            SMALL: null,
            MEDIUM: null,
            HIGH: null,
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
        const filePath = CONFIG_MEDIA.STORAGE_PATH + "/" + folder + fileName;
        writeFileSync(filePath, imageBuffer, 'utf8');

        const fileSaved = readFileSync(filePath);

        const thumbs : any[] = [];
        const resolved = CONFIG_MEDIA.RESOLUTIONS.map(async item => {
            const resized = await ResizeImg(fileSaved, {
                width: item,
            });
            const fileResizedName =  `${name}_${item}.${ext}`;
            const filename_resized = CONFIG_MEDIA.STORAGE_PATH + folder + "/" + fileResizedName;
            thumbs.push({ filename_resized, buffer: resized });
        });

        await Promise.all(resolved);

        const saved = thumbs.map(async item => {
            await writeFile(item.filename_resized, item.buffer, () => {});
        });

        await Promise.all(saved);
    }

    async createHTML(){
        try {

            const data = {
                name: "Ramon",
                lastname: "Olmos",
                order:{
                    id: 123,
                    status: 2
                }
            };

            var templateHtml = readFileSync(path.join(process.cwd(), '/src/templates/report.html'), 'utf8');
            var template = compile(templateHtml)(data);

            let document = {
                template:  template,
                context: {
                    name: "Hello",
                    order:{
                        id: 123
                    }
                },
                path: "./src/storage/tmp/test-"+Math.random()+".html"
            }

            var html = createHTML({
                title: 'report.html',
                body: template
            })

            await writeFile("./src/storage/tmp/test-"+Math.random()+".html", html, function(err){
                if (err) console.log(err)
            });

        }catch(e){
            console.log("error", e.message);
        }
    }

    /**
     * Generar un fichero PDF
     * Genera un fichero PDF indicando la plantilla y el objeto de entrada
     */
    async createPDF(html, format = MEDIA_FORMAT_OUTPUT.b64, options = { format: 'Legal', margin: {top: '80px'} }){
        try {
            let file = { content: html };

            if(format === MEDIA_FORMAT_OUTPUT.binary){
                const pdfBuffer = await html_to_pdf.generatePdf(file, options);
                return pdfBuffer;
            } else if(format === MEDIA_FORMAT_OUTPUT.b64){
                const pdfBuffer = await html_to_pdf.generatePdf(file, options);
                return pdfBuffer.toString('base64');
            } else if(format === MEDIA_FORMAT_OUTPUT.b64storage){
                const pdfBuffer = await html_to_pdf.generatePdf(file, options);
                const filename = "CATALOG_"+moment().unix()+".pdf";
                const url = `${CONFIG_MEDIA.PDF_PATH}/${filename}`;
                writeFile(`${CONFIG_MEDIA.STORAGE_PDF_PATH}/${filename}`, pdfBuffer, () => {});
                return {data: pdfBuffer.toString('base64'), url: url };
            }

        }catch(e){
            console.log("error", e.message);
        }
    }

    /**
     * Obtener la información de un archivo excel
     * Entregar un Formato Base64 y Devolver un archivo Excel
     * Retorna una Hoja de Calculo de Excel
     */
    async readExcel(b64string){

        var buf = Buffer.from(b64string, 'base64'); // Ta-da
        const workbook = new Excel.Workbook();
        const _excel = await workbook.xlsx.load(buf);
        const sheet : Worksheet = _excel.getWorksheet(1);

        return sheet;
    }

    createWorkSheet(exportable: any, workbook: any, data) : void{
        workbook.creator = 'Lucy Modas - APP';
        workbook.lastModifiedBy = 'Lucy Modas - APP';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.properties.date1904 = true;

        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ];

        const worksheet = workbook.addWorksheet(exportable.getSheetName());

        const body = exportable.getBody(data);

        /** Headers */
        worksheet.columns = exportable.getHeader();
        worksheet.addRows(body);

        //auto-ajust cell
        worksheet.columns.forEach(function (column, i) {
            if (i !== 0) {
                var maxLength = 0;
                column["eachCell"]({includeEmpty: true}, function (cell) {
                    var columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength;
            }
        });
    }

    /**
     * Crear un fichero Excel
     * Genera un fichero PDF indicando la plantilla y el objeto de entrada
     */
    async createExcel(exportable: any, data, res, format = MEDIA_FORMAT_OUTPUT.binary){
        try {

            const workbook = new Excel.Workbook();

            if(exportable.isMultiple()) {
                while (exportable.hasNextIterator()) {
                    exportable.getNextIterator();

                    if(exportable.invalidFormat()){
                        throw new Exception("Formato de archivo invalido");
                    }

                    this.createWorkSheet(exportable, workbook, data);
                }
            } else {

                if(exportable.invalidFormat()){
                    throw new Exception("Formato de archivo invalido");
                }

                this.createWorkSheet(exportable, workbook, data);
            }

            if(format === MEDIA_FORMAT_OUTPUT.binary) {
                res.setHeader('Content-Type', 'Content-Type: application/vnd.ms-excel');
                res.setHeader("Content-Disposition", "attachment; filename=" + exportable.getFileName());
                res.setHeader('Cache-Control', 'max-age=0');

                return await workbook.xlsx.write(res)
                    .then(function (data) {
                        res.end();
                        console.log('File write done........');
                    });
            }
            if(format === MEDIA_FORMAT_OUTPUT.b64){
                const fileBuffer = await workbook.xlsx.writeBuffer();
                return fileBuffer.toString('base64');
            }

        }catch(e){
            console.log("error", e.message);
        }
    }
}
