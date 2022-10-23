import { Request, Response, Router, Application } from "express";
import SendMailTask from '../tasks/SendMailTask';
import HttpStatusCodes from 'http-status-codes';

export default class Test {
    private router : Router;

    private constructor(app: Application, basePath: string){
        this.router = Router();
        this.initializeRouter();
        app.use(basePath,this.router);
    }

    private initializeRouter(): void{
        this.router.post('/',this.sendMail);
    }

    private async sendMail (req: Request, res: Response): Promise<void>{
        try{
            await SendMailTask('claudioalejandro4@gmail.com','<h1>Test<h1>','Subject test');
            res.status(HttpStatusCodes.OK).end();
        }catch(e){
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
            console.error(e);
        }
        
        
    }

    public static mount(app: Application): Test {
        return new Test(app,'/test');
    }
}
