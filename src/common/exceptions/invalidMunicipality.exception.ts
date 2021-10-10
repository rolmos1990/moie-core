export class InvalidMunicipalityException extends Error {
    public readonly name: string;
    constructor(message: string = 'Municipio no es valido') {
        super(message);
        this.name = "invalidMunicipality";
    }
}
