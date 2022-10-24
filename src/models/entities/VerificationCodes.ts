import DatabaseConnection from 'database/DatabaseConnection';
import {Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Repository} from 'typeorm';
import User from './User';

@Entity({name: 'verificationCodes'})
export default class VerificationCodes {
    
    @PrimaryColumn({type:'int', unsigned: true, nullable: false, unique: true})
    public id: number;
    @ OneToOne(()=>User)
    @JoinColumn()
    user?: User;


    @Column({type:'datetime', nullable: false})
    public creationDateTime: Date;
    
public constructor(){
    }
    public static async getRepositoryVerificationCodes(): Promise<Repository<VerificationCodes>> {
        const databaseConnection = await DatabaseConnection.getConectedInstance();
        return databaseConnection.getRepository(VerificationCodes);
    }
/*
    public static async generarToken( 

    ): Promise<VerificationCodes> {
        const repositorioVerificationCodes = await this.getRepositoryVerificationCodes();

        const verificationCodes = await repositorioVerificationCodes.findOne
        
    }*/
}