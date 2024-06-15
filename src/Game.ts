

export class Game {
    private _lastSymbol: string = ' ';
    private _board: Board = new Board();

    public Play(symbol: string, x: number, y: number) : void {
        // Nếu là lần chơi đầu tiên
        if (this._lastSymbol == ' ') {
            // Nếu người chơi là O
            if (symbol == 'O') {
                throw new Error("Invalid first player");
            }
        }
        // Nếu không phải lần chơi đầu tiên nhưng người chơi lặp lại
        else if (symbol == this._lastSymbol) {
            throw new Error("Invalid next player");
        }
        // Nếu không phải lần chơi đầu tiên nhưng chơi vào ô đã đánh
        else if (this._board.TileAt(x, y).Symbol != ' ') {
            throw new Error("Invalid position");
        }

        // Cập nhật trạng thái trò chơi
        this._lastSymbol = symbol;
        this._board.AddTileAt(symbol, x, y);
    }

    public Winner() : string {
        // Kiểm tra các hàng
        for (let i = 0; i < 3; i++) {
            if (this._board.TileAt(i, 0)!.Symbol != ' ' &&
                this._board.TileAt(i, 0)!.Symbol == this._board.TileAt(i, 1)!.Symbol &&
                this._board.TileAt(i, 1)!.Symbol == this._board.TileAt(i, 2)!.Symbol) {
                return this._board.TileAt(i, 0)!.Symbol;
            }
        }

        // Kiểm tra các cột
        for (let i = 0; i < 3; i++) {
            if (this._board.TileAt(0, i)!.Symbol != ' ' &&
                this._board.TileAt(0, i)!.Symbol == this._board.TileAt(1, i)!.Symbol &&
                this._board.TileAt(1, i)!.Symbol == this._board.TileAt(2, i)!.Symbol) {
                return this._board.TileAt(0, i)!.Symbol;
            }
        }

        // Kiểm tra các đường chéo
        if (this._board.TileAt(0, 0)!.Symbol != ' ' &&
            this._board.TileAt(0, 0)!.Symbol == this._board.TileAt(1, 1)!.Symbol &&
            this._board.TileAt(1, 1)!.Symbol == this._board.TileAt(2, 2)!.Symbol) {
            return this._board.TileAt(0, 0)!.Symbol;
        }

        if (this._board.TileAt(2, 0)!.Symbol != ' ' &&
            this._board.TileAt(2, 0)!.Symbol == this._board.TileAt(1, 1)!.Symbol &&
            this._board.TileAt(1, 1)!.Symbol == this._board.TileAt(0, 2)!.Symbol) {
            return this._board.TileAt(2, 0)!.Symbol;
        }

        return ' ';
    }
}

interface Tile {
    X: number;
    Y: number;
    Symbol: string;
}

class Board {
    private _plays : Tile[] = [];

    constructor() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const tile : Tile = {X : i, Y : j, Symbol : " "};
                this._plays.push(tile);
            }
        }
    }

    public TileAt(x:  number, y: number): Tile {
        return this._plays.find((t:Tile) => t.X == x && t.Y == y)!;
    }

    public AddTileAt(symbol: string, x: number, y: number) : void {
        this._plays.find((t:Tile) => t.X == x && t.Y == y)!.Symbol = symbol;
    }
}
