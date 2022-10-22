import User from '@entities/User';
import { DataSource, ObjectLiteral, EntityTarget, Repository } from 'typeorm';

export default class DatabaseConnection {
    private static dataSource: DataSource;

    public static async getConectedInsance(): Promise<DataSource>{
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
        const dataSource = await DatabaseConnection.getConectedInsance();
        return dataSource.getRepository(entityTarget);
    }
}
