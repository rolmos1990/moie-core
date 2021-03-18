export class InvalidArgumentException extends Error {
    public readonly name: string;
    constructor(message: string = 'Parametros invalidos.') {
        super(message);
        this.name = "InvalidArgumentException";
    }
}
