
import { Game } from '../models/index.js';

class GameRepository {
  async findById(id) {
    return Game.findById(id)
  }

  /**
   * to create new Game
   * @param {string} userId 
   * @param {string} name 
   * @param {Int8Array} board 
   * @param {number} currentPlayer
   */
  async createNewGame(userId, name, board, currentPlayer) {
    const newGame = new Game({
        userId,
        name,
        board: Array.from(board),
        currentPlayer,
        status: 'active'
    });

    await newGame.save();
    return newGame.id;
  }

  async updateGameInfo(board, gameId, currentPlayer) {
      const gameDoc = await Game.findById(gameId);

      if (!gameDoc) {
        throw new Error(`Game not found with gameId: ${gameId}`);
      }

      gameDoc.board = Array.from(board);
      gameDoc.currentPlayer = currentPlayer;
      await gameDoc.save();
  }
}

export const gameRepository = new GameRepository();