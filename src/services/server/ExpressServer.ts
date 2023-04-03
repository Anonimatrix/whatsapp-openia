import express from 'express';
import { ServerInterface } from './Interfaces/ServerInterface';
import wppRouter from '../../routes/wpp.routes';

export class ExpressServer implements ServerInterface {
    private app: express.Application;

    constructor() {
        this.app = express();
    }

    public async init(port: number = 3000) {
        this.middleware();
        this.routes();

        return await this.listen(port);
    }

    public routes() {
        this.app.use('/wpp', wppRouter);
    }

    public middleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public async listen(port: number): Promise<number> {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            });
        });
    }
}