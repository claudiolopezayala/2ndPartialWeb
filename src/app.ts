import express, { Application } from 'express';
import cors, {CorsOptions} from 'cors';
import bodyParser from 'body-parser';
import Test from './controllers/Test';
import AuthenticationController from './controllers/AuthenticationController';
import ChangeDataController from './controllers/ChangeDataController';

const app: Application = express();

const CorsOptions: CorsOptions={
    origin: 'http//localhost:3000',
    optionsSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(cors());

Test.mount(app);
AuthenticationController.mount(app);
ChangeDataController.mount(app);

export default app;