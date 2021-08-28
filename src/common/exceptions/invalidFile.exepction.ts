export class InvalidFileException extends Error {
    public readonly name: string;
    constructor(message: string = 'Archivo no puede ser procesado.') {
        super(message);
        this.name = "InvalidFileException";
    }
}
