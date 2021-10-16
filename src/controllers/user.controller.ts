import {Request, Response} from 'express';
import {route, GET, POST} from 'awilix-express';
import {UserService} from "../services/user.service";
import {BaseController} from "../common/controllers/base.controller";
import {User} from "../models/User";
import {EntityTarget} from "typeorm";
import {UserCreateDTO, UserListDTO, UserUpdateDTO} from './parsers/user';
import {CONFIG_MEDIA, MediaManagementService} from "../services/mediaManagement.service";

@route('/user')
export class UserController extends BaseController<User> {
    constructor(
        private readonly userService: UserService,
        private readonly mediaManagementService: MediaManagementService
    ){
        super(userService);
    };

    public getInstance() : User{
        return new User();
    }

    getParseGET(entity: User): Object {
        return UserListDTO(entity);
    }

    getParsePOST(entity: User): Object {
        return UserCreateDTO(entity);
    }

    getParsePUT(entity: User): Object {
        return UserUpdateDTO(entity);
    }

    public getEntityTarget(): EntityTarget<any> {
        return User;
    }

    @route("/login")
    @POST()
    public async login(req: Request, res: Response) {
        try {
        const {username, password} = req.body;
            const response = await this.userService.login(username, password);
            res.json(response);
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/changePassword")
    @POST()
    public async changePassword(req: Request, res: Response) {
        try {
            const {username, password} = req.body;
            const response = await this.userService.changePassword(username, password);
            res.json(response);
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/changeProfilePicture")
    @POST()
    public async changeProfilePicture(req: Request, res: Response) {
        try {

            const {photo} = req.body;
            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);

            const imageResource = this.mediaManagementService.createImageFile(CONFIG_MEDIA.PICTURES_FOLDERS, user.id, photo);
            user.photo = imageResource.fullepath_v;
            await this.userService.createOrUpdate(user);

            res.json({ user: { photo: user.photo }});

        }catch(e){
            this.handleException(e, res);
        }
    }

    protected beforeCreate(item: User){}
    protected afterCreate(item: Object): void {}
    protected afterUpdate(item: Object): void {}
    protected beforeUpdate(item: Object): void {}

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
