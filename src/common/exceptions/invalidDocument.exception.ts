export class InvalidDocumentException extends Error {
    public readonly name: string;
    constructor(message: string = 'Documento no es valido') {
        super(message);
        this.name = "invalidDocument";
    }
}
