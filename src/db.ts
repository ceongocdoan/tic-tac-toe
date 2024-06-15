import mysql from 'mysql2/promise';

export class Database {
    private static instance: Database;
    private connection: mysql.Connection;

    private constructor() {
        this.init();
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private async init() {
        this.connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'tic_tac_toe'
        });

        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                player VARCHAR(255) NOT NULL,
                moves INT NOT NULL
            )
        `);
    }

    public async saveWinner(player: string, moves: number) {
        await this.connection.execute('INSERT INTO leaderboard (player, moves) VALUES (?, ?)', [player, moves]);
    }

    public async getLeaderboard(): Promise<{ player: string, moves: number }[]> {
        const [rows] = await this.connection.execute('SELECT player, moves FROM leaderboard ORDER BY moves ASC LIMIT 5');
        return rows as { player: string, moves: number }[];
    }
}
