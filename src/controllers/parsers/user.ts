import {User} from "../../models/User";
import * as Bcrypt from "bcryptjs";
import {SecurityRolArrayShortDTO} from "./securityRol";

export const UserListDTO = (user: User) => ({
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    status: user.status,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    photo: user.photo,
    securityRol: SecurityRolArrayShortDTO(user.securityRol || {})
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
    updatedAt: null,
    securityRol: user.securityRol && user.securityRol.id
});

export const UserUpdateDTO = (user: User) => ({
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    status: user.status,
    updatedAt: new Date(),
    securityRol: user.securityRol && user.securityRol.id
});

export const UserShortDTO = (user: User) => ({
    id: user ? user.id : null,
    name: user ? user.name + " " + user.lastname : null,
    photo: user ? user.photo : null,
});
