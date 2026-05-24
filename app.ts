import express, { Request, Response, json } from 'express';
import router from "./routes"
import path from "path"

function createApp() {
    const app = express();

    app.use(json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'docs')));
    app.use('/api', router);

    return app;
}

export default createApp;