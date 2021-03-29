import * as Bcrypt from "bcryptjs";

const salt = Bcrypt.genSaltSync();

export const UserSeed = [
   {
       name: "Ramon",
       lastname: "Ramon",
       email: "ramon.olmos90@gmail.com",
       username: "rolmos",
       password: Bcrypt.hashSync("Panama2020.", salt),
       salt: salt,
       status: true,
       lastLogin: null,
       createdAt: new Date(),
       updatedAt: null
    },
    {
        name: "Yoel",
        lastname: "Gonzalez",
        email: "ygonzalez.work@gmail.com",
        username: "ygonzalez",
        password: Bcrypt.hashSync("Panama2020.", salt),
        salt: salt,
        status: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: null
    },
    {
        name: "User",
        lastname: "Test",
        email: "test1@gmail.com",
        username: "test1",
        password: Bcrypt.hashSync("test1", salt),
        salt: salt,
        status: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: null
    },
    {
        name: "User",
        lastname: "Test2",
        email: "test2@gmail.com",
        username: "test2",
        password: Bcrypt.hashSync("test1", salt),
        salt: salt,
        status: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: null
    },
    {
        name: "User",
        lastname: "Test3",
        email: "test3@gmail.com",
        username: "test3",
        password: Bcrypt.hashSync("test1", salt),
        salt: salt,
        status: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: null
    },
];
