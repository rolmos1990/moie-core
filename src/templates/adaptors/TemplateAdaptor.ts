export abstract class TemplateAdaptor<T> {
    protected resource : T;
    constructor(resource: T) {
        this.resource = resource;
    }
    abstract getData() : Object
}
