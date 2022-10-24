import BaseController from "./BaseController";
import { Request, Response, Application } from "express";

interface ChangePasswordBody{
    oldPassword: string;
    newPassword: string;
}


export default class ChangeDataController extends BaseController{
    protected initializeRouter(): void {
        this.router.put('ChangePassword',this.ChangePassword);
    }

    private async ChangePassword (req: Request, res: Response):Promise<void>{

    }

}