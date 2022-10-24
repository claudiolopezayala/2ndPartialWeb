import BaseController from "./BaseController";
import { Request, Response, Application } from "express";
import Session from  '@models/Session';
import HttpStatusCodes from 'http-status-codes';
import User from '@entities/User';
import { QueryFailedError } from "typeorm";

interface ChangePasswordBody{
    mail: string;
    oldPassword: string;
    newPassword: string;
}


export default class ChangeDataController extends BaseController{
    protected initializeRouter(): void {
        this.router.all('*',Session.ValidarSesion);
        this.router.put('/ChangePassword',this.ChangePassword);
    }

    private async ChangePassword (req: Request, res: Response):Promise<void>{
        try{
            const{
                mail,
                oldPassword,
                newPassword
            } = <ChangePasswordBody>req.body;
            try{
                const repositoryUser = await User.getRepositoryUser()
                
                const user = await repositoryUser.findOneBy({mail, password: oldPassword})

                if(!user){
                    res.status(HttpStatusCodes.FORBIDDEN).end();
                    return;
                }

                //*************************************************might not work 
                user.password = newPassword

                try {
                    await repositoryUser.save(user);
                } catch (e) {
                    if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
                        throw new Error('ErrorModeloDuplicado');
                    }
        
                    throw e;
                }
                res.status(HttpStatusCodes.OK).json(user);

            }catch(e){
                console.error(e);
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
                return;
            }
        }catch(e){
            console.error(e);
            res.status(HttpStatusCodes.BAD_REQUEST).end();
        }
    }

    public static mount(app: Application): ChangeDataController {
        return new ChangeDataController(app,'/ChangeData');
    }

}