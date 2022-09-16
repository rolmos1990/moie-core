import { app } from './app';
const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${HOST}:${PORT}`);
});
