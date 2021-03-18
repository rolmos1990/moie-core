export class ConditionalException extends Error {
    public readonly name: string;
    constructor(message: string = 'Condiciones enviadas invalidas.') {
        super(message);
        this.name = "ConditionalException";
    }
}
