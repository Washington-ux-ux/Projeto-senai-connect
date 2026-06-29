import express, { Request, Response, json } from 'express';
import router from "./routes"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createApp() {
    const app = express();

    app.use(json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(express.static(path.join(__dirname, 'docs')));
    app.use('/api', router);

    return app;
}

export default createApp;