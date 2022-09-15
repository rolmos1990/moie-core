import { app } from './app';
const PORT = process.env.PORT || 8086;
const HOST = process.env.HOST;

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${HOST}:${PORT}`);
});
