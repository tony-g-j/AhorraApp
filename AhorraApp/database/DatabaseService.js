import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize(){
        this.db = await SQLite.openDatabaseAsync('Ahorrapp.db');
        await this.db.execAsync(`
                
            `)
    }
}