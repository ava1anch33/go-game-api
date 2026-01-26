import { gameService } from "../services/index.js"
import { successResponse, checkUserExist } from '../utils/index.js';

async function createNewGame(req, res, next) {
    try {
        const currentUser = checkUserExist(req)
        const { name, aiFirst = false } = req.body;
        const userId = currentUser.id;
        const { gameId, board, currentPlayer } = await gameService.createNewGame({ 
            userId, 
            name, 
            aiFirst 
        });
        successResponse(res, {
            gameId,
            board: Array.from(board),
            currentPlayer
        });
    } catch (error) {
        next(error);
    }
}

async function aiThinking(req, res, next) {
    try {
        const currentUser = checkUserExist(req)
        const { board, gameId, currentPlayer:cPlayer } = req.body;

        const { board: newBoard, currentPlayer } = await gameService.aiThinking(board, gameId, cPlayer)

        successResponse(res, {
            gameId,
            board: Array.from(board),
            currentPlayer
        });  
    } catch (error) {
        next(error)
    }
}

export default {
    createNewGame,
    aiThinking
}