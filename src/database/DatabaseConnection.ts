import User from '../models/entities/User';
import VerificationCodes from '../models/entities/MailVerificationCode';
import { DataSource, ObjectLiteral, EntityTarget, Repository } from 'typeorm';

export default class DatabaseConnection {
    private static dataSource: DataSource;

    public static async getConectedInstance(): Promise<DataSource>{
        if(!DatabaseConnection.dataSource){
            DatabaseConnection.dataSource = new DataSource({
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'wiki',
                synchronize: true,
                entities: [User]
            });
            if (!DatabaseConnection.dataSource.isInitialized){
                await DatabaseConnection.dataSource.initialize();
            }
        }
        return DatabaseConnection.dataSource;
    }

    public static async getRepository<Entity extends ObjectLiteral>(
        entityTarget: EntityTarget<Entity>
    ): Promise<Repository<Entity>>{
        const dataSource = await DatabaseConnection.getConectedInstance();
        return dataSource.getRepository(entityTarget);
    }
}
