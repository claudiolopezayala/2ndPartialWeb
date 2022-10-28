import BaseController from "./BaseController";
import Session from "../models/Session";
import { Application, Request, Response } from "express";
import SendMailTask from "../tasks/SendMailTask";
import HttpStatusCodes from 'http-status-codes';
import User from '../models/entities/User';
import MailVerificationCode from '../models/entities/MailVerificationCode';

interface sendRecuperationEmailBody{
    mail:string;
}
interface changePassword{
    newPassword:string;
    mailVerificationCodeId:number;
}

export default class RecoverPasswordController extends BaseController{
    protected initializeRouter(): void {
        this.router.get('/sendRecuperationMail',this.sendRecuperationMail);
        this.router.put('/changePassword',this.changePassword);
    }

    private async changePassword (req: Request, res: Response): Promise<void>{
        try{
            const {newPassword, mailVerificationCodeId} = <changePassword> req.body;

            if(!mailVerificationCodeId || !newPassword ){
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }            

            const mailVerificationCodeRepository = await MailVerificationCode.getMailRepositoryVerificationCode();
            //const mailVerificationCode = await mailVerificationCodeRepository.createQueryBuilder("MailVerificationCode").leftJoinAndSelect("MailVerificationCode.User","User").getMany();

            const mailVerificationCode = await mailVerificationCodeRepository.find({
                relations: {
                    user: true,
                },
            })
            const fiveMinutesInMiliseconds = 5 * 60 * 1000;
            if(!mailVerificationCode || ((new Date()).getTime() - mailVerificationCode[0].creationDateTime.getTime()) > fiveMinutesInMiliseconds){
                res.status(HttpStatusCodes.FORBIDDEN).end();
                return;
            }

            const userRepository = await User.getRepositoryUser();
            console.log(mailVerificationCode);
            
            //onst user = await userRepository.findOneBy({mail : mailVerificationCode.user.mail})
            const user = mailVerificationCode[0].user;
            if (!user){
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
                return;
            }
            user.password = newPassword;
            user.updateDateTime = new Date();
            await userRepository.save(user);

            res.status(HttpStatusCodes.OK).end();
        }catch(e){
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
            console.error(e);
        }
    }

    private async sendRecuperationMail(req: Request, res: Response): Promise<void>{
        try{
            const userRepository = User.getRepositoryUser();
            const {mail} = <sendRecuperationEmailBody> req.body;
            if(!mail){
                res.status(HttpStatusCodes.BAD_REQUEST).end()
            }
            const user = await (await userRepository).findOneBy({mail});
            if(!user){
                res.status(HttpStatusCodes.FORBIDDEN).end();
                return;
            }
            
            const mailVerificationCodeRepository = await MailVerificationCode.getMailRepositoryVerificationCode();
            
            const mailVerificationCode = await mailVerificationCodeRepository.save(await MailVerificationCode.createMailVerificationCode(user));

            await SendMailTask(mail,`<h1>Password recovery<h1><p>click the following link to recover your password (not ready yet code: <b>${mailVerificationCode.id}</b>)</p>`,'Password recovery');
            res.status(HttpStatusCodes.OK).end();
        }catch(e){
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
            console.error(e);
        }
    }

    public static mount(app: Application): RecoverPasswordController {
        return new RecoverPasswordController(app,'/recoverPassword');
    }

}