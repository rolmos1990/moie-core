import {User} from "../../models/User";
import * as Bcrypt from "bcryptjs";

export const UserListDTO = (user: User) => ({
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    status: user.status,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

export const UserCreateDTO = (user: User, salt = Bcrypt.genSaltSync()) => ({
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    password: Bcrypt.hashSync(user.password, salt),
    salt: salt,
    status: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: null
});

export const UserUpdateDTO = (user: User) => ({
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    status: user.status,
    updatedAt: new Date()
});
