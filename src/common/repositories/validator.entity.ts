import {Repository} from "typeorm";
import {PageQuery} from "../controllers/page.query";
import { validate } from "class-validator";

export default abstract class ValidatorEntity<Parse, ParseGET, ParsePOST> {

    private parse:Parse;
    private parseGET:ParseGET;
    private parsePOST:ParsePOST;

    addParse(parse: Parse){
        return parse;
    }
    addParseGET(parseGET: ParseGET){
        return parseGET;
    }
    addParsePOST(parsePOST: ParsePOST){
        return parsePOST;
    }

    getParse() : Parse{
        return this.parse;
    }

    getParseGET() : ParseGET{
        return this.parseGET;
    }

    getParsePOST() : ParsePOST {
        return this.parsePOST;
    }

    validate(entity: Object) {
        validate(entity);
    }
}
