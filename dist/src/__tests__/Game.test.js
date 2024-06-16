"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("../Game");
describe('TicTacToe game', function () {
    var game;
    beforeEach(function () {
        game = new Game_1.Game();
    });
    it('should not allow player O to play first', function () {
        expect(function () { return game.Play('O', 0, 0); }).toThrow();
    });
    it('should not allow player x to play twice in a row', function () {
        game.Play('X', 0, 0);
        expect(function () { return game.Play('X', 1, 0); }).toThrow();
    });
    it('should not allow a player to play in last played position', function () {
        game.Play('X', 0, 0);
        expect(function () { return game.Play('O', 0, 0); }).toThrow();
    });
    it('should not allow a player to play in any played position', function () {
        game.Play('X', 0, 0);
        game.Play('O', 1, 0);
        expect(function () { return game.Play('X', 0, 0); }).toThrow();
    });
    it('should declare player X as winner if it plays three in top row', function () {
        game.Play('X', 0, 0);
        game.Play('O', 1, 0);
        game.Play('X', 0, 1);
        game.Play('O', 1, 1);
        game.Play('X', 0, 2);
        var winner = game.Winner();
        expect(winner).toBe("X");
    });
    it('should declare player O as winner if it plays three in top row', function () {
        game.Play('X', 1, 0);
        game.Play('O', 0, 0);
        game.Play('X', 1, 1);
        game.Play('O', 0, 1);
        game.Play('X', 2, 2);
        game.Play('O', 0, 2);
        var winner = game.Winner();
        expect(winner).toBe("O");
    });
    it('should declare player X as winner if it plays three in middle row', function () {
        game.Play('X', 1, 0);
        game.Play('O', 0, 0);
        game.Play('X', 1, 1);
        game.Play('O', 0, 1);
        game.Play('X', 1, 2);
        var winner = game.Winner();
        expect(winner).toBe("X");
    });
    it('should declare player O as winner if it plays three in middle row', function () {
        game.Play('X', 0, 0);
        game.Play('O', 1, 0);
        game.Play('X', 2, 1);
        game.Play('O', 1, 1);
        game.Play('X', 2, 2);
        game.Play('O', 1, 2);
        var winner = game.Winner();
        expect(winner).toBe("O");
    });
    it('should declare player X as winner if it plays three in bottom row', function () {
        game.Play('X', 2, 0);
        game.Play('O', 0, 0);
        game.Play('X', 2, 1);
        game.Play('O', 0, 1);
        game.Play('X', 2, 2);
        var winner = game.Winner();
        expect(winner).toBe("X");
    });
    it('should declare player O as winner if it plays three in bottom row', function () {
        game.Play('X', 0, 0);
        game.Play('O', 2, 0);
        game.Play('X', 1, 1);
        game.Play('O', 2, 1);
        game.Play('X', 0, 1);
        game.Play('O', 2, 2);
        var winner = game.Winner();
        expect(winner).toBe("O");
    });
});
