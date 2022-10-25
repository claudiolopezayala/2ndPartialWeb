import DatabaseConnection from 'database/DatabaseConnection';
import {Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Repository} from 'typeorm';
import User from './User';

@Entity({name: 'MailVerificationCode'})
export default class MailVerificationCode {
    
    @PrimaryColumn({type:'int', unsigned: true, nullable: false, unique: true})
    public id: number;
    @ OneToOne(()=>User)
    @JoinColumn()
    user?: User;


    @Column({type:'datetime', nullable: false})
    public creationDateTime: Date;
    
    private constructor(_id: number,_user: User){
        this.id = _id;
        this.user = _user;
    }
    public static async getMailRepositoryVerificationCode(): Promise<Repository<MailVerificationCode>> {
        const databaseConnection = await DatabaseConnection.getConectedInstance();
        return databaseConnection.getRepository(MailVerificationCode);
    }

    public async createMailVerificationCode (_user: User): Promise<MailVerificationCode>{
        const repositoryMailVerificationCode = await MailVerificationCode.getMailRepositoryVerificationCode();
        const provitionalId = Math.floor(Math.random()*(999999+1));
        let existingMailVerificationCode = await repositoryMailVerificationCode.findOneBy({id:provitionalId})

        if(!existingMailVerificationCode){
            existingMailVerificationCode = new MailVerificationCode(
                provitionalId,
                _user
            )
        }else{
            existingMailVerificationCode.user = _user;
            existingMailVerificationCode.creationDateTime = new Date();
        }
        return existingMailVerificationCode;
    }
}