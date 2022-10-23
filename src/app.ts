import express, { Application } from 'express';
import cors, {CorsOptions} from 'cors';
import bodyParser from 'body-parser';
import Test from './controllers/Test';

const app: Application = express();

const CorsOptions: CorsOptions={
    origin: 'http//localhost:3000',
    optionsSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(cors());

Test.mount(app);

export default app;