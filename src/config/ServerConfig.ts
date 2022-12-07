//const TIME_DEFAULT = Math.floor(Date.now() / 1000) + (60 * 60); //1 Hour
//console.log('CURRENT TIME DEFAULT: ', TIME_DEFAULT);

export const serverConfig = {
    jwtExpiration: 44200,
    jwtSecret: process.env.JWT_SECRET || "test"
};
