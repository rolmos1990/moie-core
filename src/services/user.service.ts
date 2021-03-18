import { User } from '../models/User';
import {UserRepository} from "../repositories/user.repository";
import {BaseService} from "../common/controllers/base.service";
import {InvalidArgumentException} from "../common/exceptions";
import { serverConfig } from '../config/ServerConfig';
import * as Bcrypt from "bcryptjs";
import * as Jwt from "jsonwebtoken";
import { UserListDTO } from "../controllers/parsers/user";

export class UserService extends BaseService<User> {
    constructor(
        private readonly userRepository: UserRepository<User>
    ){
        super(userRepository);
    }

    public async login(usernameOrEmail: string, password: string){
            if(!password || !usernameOrEmail){
                throw new InvalidArgumentException();
            }

            const user = await this.userRepository.findByUsername(usernameOrEmail);
            if (user.isEmpty() || !this.validatePassword(password, user.password)) {
                throw new InvalidArgumentException();
            }
            const token = this.generateToken(user);
            return {
                user: UserListDTO(user),
                token: token
            }
    }

    private validatePassword(requestPassword: string, accountPassword: string) {
        return Bcrypt.compareSync(requestPassword, accountPassword);
    }


    private generateToken(user: User) {
        const payload = { id: user.id, username: user.username };
        return Jwt.sign(payload, serverConfig.jwtSecret, { expiresIn: serverConfig.jwtExpiration });
    }
}
