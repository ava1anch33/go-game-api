import { analystService } from "../services/index.js"
import { successResponse, checkUserExist } from '../utils/index.js';

async function givenGameAnalyst(req, res, next) {
    try {
        const { board } = req.body
        const { influence } = await analystService.givenBoardAnalyst(board)

        successResponse(res, {
            influence: Array.from(influence)
        });  
    } catch (error) {
        next(error)
    }
}

export default {
    givenGameAnalyst
}