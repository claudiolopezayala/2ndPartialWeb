import BaseController from "./BaseController";
import { Request, Response, Application } from "express";


export default class ChangeDataController extends BaseController{
    protected initializeRouter(): void {
        this.router.put('ChangePassword',this.ChangePassword);
    }

    private async ChangePassword ():Promise<void>{

    }

}