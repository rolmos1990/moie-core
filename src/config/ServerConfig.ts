const TIME_DEFAULT = Math.floor(Date.now() / 1000) + (60 * 60); //1 Hour

export const serverConfig = {
    jwtExpiration: process.env.jWT_EXPIRATION || TIME_DEFAULT,
    jwtSecret: process.env.JWT_SECRET || "test",
    isFakeCounters: true,
    fakeCounterLimit: 5000,
};
