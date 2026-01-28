
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

  async endGame(gameId, board) {
    await Game.findOneAndUpdate(
        { _id: gameId },
        {
            $set: {
                board: Array.from(board),
                status: 'finished',
            },
        },
        {
            new: true,         
            runValidators: true
        }
    )
  }

  async updateGameInfo(
    board,
    gameId,
    currentPlayer,
  ) {
        await Game.findOneAndUpdate(
            { _id: gameId },
            {
                $set: {
                    board: Array.from(board),
                    currentPlayer,
                },
            },
            {
                new: true,         
                runValidators: true
            }
        )
    }
}

export const gameRepository = new GameRepository();