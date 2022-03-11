import {User} from '../models/User';
import {EntityNotFoundError, getRepository, Repository} from "typeorm";
import BaseRepository from '../common/repositories/base.repository';
import {InvalidArgumentException, ApplicationException} from "../common/exceptions";
import * as Bcrypt from "bcryptjs";

export class UserRepository<T> extends BaseRepository<User>{

    protected readonly repositoryManager : Repository<User>;

    constructor(){
        super();
        this.repositoryManager = getRepository(User);
    }

    public async findByEmail(usernameOrEmail: string) : Promise<User>{
        let user = await this.repositoryManager.findOneOrFail({email: usernameOrEmail});
        return user;
    }

    public async findByUsername(usernameOrEmail: string) : Promise<User> {
        let user = await this.repositoryManager.findOne({username: usernameOrEmail}, {relations: ['securityRol', 'securityRol.permissions']});
        return user || new User();
    }

    public async changePassword(usernameOrEmail: string, password: string) : Promise<User> {

        const salt = Bcrypt.genSaltSync();

        let user = await this.repositoryManager.findOne({username: usernameOrEmail});
        user.password = Bcrypt.hashSync(password, salt);
        user.salt = salt;

        const result = await this.repositoryManager.save(user);
        return result;
    }
}
