import { gameRepository } from '../repositories/index.js';
import { setStone, SimpleGoAI, captureGroups, cloneBoard } from '../utils/index.js'

class GameService {
    boardSize = 361

    toggleCurrentPlayer(currentPlayer) {
        return currentPlayer === 1 ? 2 : 1
    }

    async createNewGame({ userId, name, aiFirst }) {
        const board = new Int8Array(this.boardSize).fill(0);

        let currentPlayer = 1;  // black go first

        // let ai go first
        if (aiFirst) {
            currentPlayer = 2;
            const aiFirstMove = { x: 19 - 3, y: 2 };  // top right star position
            setStone(board, aiFirstMove.x, aiFirstMove.y, 1);
        }

        const gameId = await gameRepository.createNewGame(
            userId, 
            name,
            board, 
            currentPlayer
        )

        return { gameId, board, currentPlayer }
    }

    async aiThinking(passBoard, gameId, cPlayer, aiAttempts = 2) {
        const ai = new SimpleGoAI(cloneBoard(passBoard), aiAttempts);
        const aiMove = ai.think(cPlayer);

        let aiSuccess = false;
        if (aiMove) {
            setStone(passBoard, aiMove.x, aiMove.y, cPlayer);   
            captureGroups(passBoard, aiMove.x, aiMove.y, cPlayer);
            aiSuccess = true;
        }
        const currentPlayer = this.toggleCurrentPlayer(cPlayer);
        await gameRepository.updateGameInfo(passBoard, gameId, currentPlayer);
        return { aiSuccess, board: passBoard, currentPlayer };
    }

    async endGame(board, gameId) {
        await gameRepository.endGame(
            gameId, 
            board
        )
    }
}

export const gameService = new GameService()