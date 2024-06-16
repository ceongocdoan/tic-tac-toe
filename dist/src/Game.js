"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game() {
        this._lastSymbol = ' ';
        this._board = new Board();
    }
    Game.prototype.Play = function (symbol, x, y) {
        if (this._lastSymbol === ' ') {
            if (symbol === 'O') {
                throw new Error("Invalid first player");
            }
        }
        else if (symbol === this._lastSymbol) {
            throw new Error("Invalid next player");
        }
        else if (this._board.TileAt(x, y).Symbol !== ' ') {
            throw new Error("Invalid position");
        }
        this._lastSymbol = symbol;
        this._board.AddTileAt(symbol, x, y);
    };
    Game.prototype.Winner = function () {
        for (var i = 0; i < 3; i++) {
            if (this._board.TileAt(i, 0).Symbol !== ' ' &&
                this._board.TileAt(i, 0).Symbol === this._board.TileAt(i, 1).Symbol &&
                this._board.TileAt(i, 1).Symbol === this._board.TileAt(i, 2).Symbol) {
                return this._board.TileAt(i, 0).Symbol;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (this._board.TileAt(0, i).Symbol !== ' ' &&
                this._board.TileAt(0, i).Symbol === this._board.TileAt(1, i).Symbol &&
                this._board.TileAt(1, i).Symbol === this._board.TileAt(2, i).Symbol) {
                return this._board.TileAt(0, i).Symbol;
            }
        }
        if (this._board.TileAt(0, 0).Symbol !== ' ' &&
            this._board.TileAt(0, 0).Symbol === this._board.TileAt(1, 1).Symbol &&
            this._board.TileAt(1, 1).Symbol === this._board.TileAt(2, 2).Symbol) {
            return this._board.TileAt(0, 0).Symbol;
        }
        if (this._board.TileAt(2, 0).Symbol !== ' ' &&
            this._board.TileAt(2, 0).Symbol === this._board.TileAt(1, 1).Symbol &&
            this._board.TileAt(1, 1).Symbol === this._board.TileAt(0, 2).Symbol) {
            return this._board.TileAt(2, 0).Symbol;
        }
        return ' ';
    };
    Game.prototype.getEmptyTiles = function () {
        return this._board.getEmptyTiles();
    };
    return Game;
}());
exports.Game = Game;
var Board = /** @class */ (function () {
    function Board() {
        this._plays = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var tile = { X: i, Y: j, Symbol: " " };
                this._plays.push(tile);
            }
        }
    }
    Board.prototype.TileAt = function (x, y) {
        return this._plays.find(function (t) { return t.X == x && t.Y == y; });
    };
    Board.prototype.AddTileAt = function (symbol, x, y) {
        this._plays.find(function (t) { return t.X == x && t.Y == y; }).Symbol = symbol;
    };
    Board.prototype.getEmptyTiles = function () {
        return this._plays.filter(function (t) { return t.Symbol === ' '; });
    };
    return Board;
}());
