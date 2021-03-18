export class ApplicationException extends Error {
    public readonly name: string;
    constructor(message: string = 'No podemos realizar esta operación.') {
        super(message);
        this.name = "ApplicationException";
    }
}
