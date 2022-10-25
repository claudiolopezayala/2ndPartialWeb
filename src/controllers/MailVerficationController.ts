import { Application, Request, Response } from "express";
import BaseController from "./BaseController";
import HttpStatusCodes from 'http-status-codes';
import MailVerificationCode from "../models/entities/MailVerificationCode";
import Session from "../models/Session";
import User from "../models/entities/User";
import SendMailTask from "../tasks/SendMailTask";

interface sendMailVerificationMailBody{
    mail: string;
}

export default class MailVerificationController extends BaseController{
    protected initializeRouter(): void {
        this.router.all('*', Session.ValidarSesion);
        this.router.get('/sendVerificationMail', this.sendMailVerificationMail);
        this.router.post('/verifyMail:mailVerificationCode', this.verifyMail)
    }

    private async sendMailVerificationMail(req: Request, res: Response): Promise<void>{
        try{
            const userRepository = User.getRepositoryUser();
            const {mail} = <sendMailVerificationMailBody>req.body;

            if(!mail){
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }
            const user = await (await userRepository).findOneBy({mail});
            if(!user){
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }
            const mailVerificationCode = await MailVerificationCode.createMailVerificationCode(user);

            await SendMailTask(mail,`<h1>Verify mail</h1><p>click the following link to verify your mail <b>${mailVerificationCode}</b></p>`,'Verify mail');

            res.status(HttpStatusCodes.OK).end();
        }catch(e){
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
            console.error(e);
        }
    }

    private async verifyMail(req: Request, res: Response): Promise<void>{
        try{
            let mailVerificationCodeId: number;
            try{
                mailVerificationCodeId = parseInt(req.params.mailVerificationCode)
            }catch{
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const mailVerificationCodeRepository = await MailVerificationCode.getMailRepositoryVerificationCode();

            const mailVerificationCode = await mailVerificationCodeRepository.findOneBy({id: mailVerificationCodeId});

            const fiveMinutesInMiliseconds = 5 * 60 * 1000;
            if(!mailVerificationCode || ((new Date()).getTime() - mailVerificationCode.creationDateTime.getTime()) < fiveMinutesInMiliseconds){
                res.status(HttpStatusCodes.FORBIDDEN).end();
            }

            const verifyBool = <sendMailVerificationMailBody> req.body;

            if(!verifyBool) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const userRepository = await User.getRepositoryUser();
            const user = await userRepository.findOneBy({mail : mailVerificationCode?.user.mail})
            
            if(!user){
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
                return;
            }
            user.verify = true;
            await userRepository.save(user);

            res.status(HttpStatusCodes.OK).end();
        }catch(e){
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
            console.error(e);
        }
    }

    public static mount(app: Application): MailVerificationController {
        return new MailVerificationController(app, '/verifyEmail');
    }
}