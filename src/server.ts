import { app } from './app';
const PORT = process.env.PORT || 8086;
const HOST = process.env.HOST;

console.log('PORT TO RUN: ', PORT);
console.log('HOST TO RUN: ', HOST);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${HOST}:${PORT}`);
});
