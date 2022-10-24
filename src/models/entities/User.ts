import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'user'})
export default class User {

    @PrimaryGeneratedColumn({type:'int', unsigned: true})
    public id: number;

    @Column({type:'varchar', length:32, nullable: false, unique: true})
    public username: string;
    
    @Column({type:'varchar', length:32, nullable: false})
    public password: string;

    @Column({type:'varchar', length:64, nullable: false, unique: true})
    public mail: string;

    @Column({type:'datetime', nullable: false})
    public creationDateTime: Date;

    @Column({type:'datetime', nullable:false})
    public updateDateTime: Date;

    @Column({type: 'boolean', nullable: false})
    public verify: boolean;

    public constructor(_username: string, _password: string, _mail: string){
        this.username = _username;
        this.password = _password;
        this.mail = _mail;
        this.creationDateTime = new Date();
        this.updateDateTime = new Date();
    }
}