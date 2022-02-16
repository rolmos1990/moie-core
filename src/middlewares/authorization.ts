import {Request, Response, NextFunction} from 'express';
import {serverConfig} from "../config/ServerConfig";
const jwt = require("jsonwebtoken");

const PublicServices = [
    "/user/login",
    "/user/logout",
    "/default",
    "/bill/generate/test",
    "/bill/reload/dian",
    "/office/gen/officePdfReport/12",
    "/category/39/test/printTestRequest",
    "/category/38/test/printTestRequest"
];;

export const Authorization = (req: Request, res: Response, next: NextFunction) => {
    //req.header("Authorization") == 'test'
    if(PublicServices.includes(req.path)){
        req['user'] = {id: 1}; //tst user
        next();
        return;
    }

    let token = req.header('Authorization');
    if (!token) return res.json({ code: 401, message: "No autorizado"});

    try {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, serverConfig.jwtSecret);
        if(!verified.id){
            return res.json({ code: 401, message: "No autorizado"});
            // Check authorization, 2 = Customer, 1 = Admin
/*            let req_url = req.baseUrl+req.route.path;*/
/*            if(req_url.includes("users/:id") && parseInt(req.params.id) !== verified.id){
                return res.status(401).send("No autorizado!");
            }*/
        }

        req['user'] = {id: verified.id, username: verified.username};
        next();
    }
    catch (err) {
        res.status(400).send("Token invalido");
    }
}
