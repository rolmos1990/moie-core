import { app } from './app';
const PORT = process.env.PORT || 18210;
const HOST = process.env.HOST || "http://54.226.170.69";

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${HOST}:${PORT}`);
});
