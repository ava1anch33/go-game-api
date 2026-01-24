import { userService } from "../services/index.js"
import { successResponse } from '../utils/index.js';

async function getUserInfo(req, res, next) {
    try {
        const { email } = req.body
        const user = await userService.getUserByEmail(email)
        formatReturnUser(user, res)
    } catch (error) {
        next(error)
    }
}

async function updateUserInfo(req, res, next) {
    try {
        const { user: newUserInfo } = req.body
        const user = await userService.updateUser(newUserInfo)
        formatReturnUser(user, res)
    } catch (error) {
        next(error)
    }
}

function formatReturnUser(user, res) {
    const forbiddenFields = ['password', 'role', 'googleId', 'wechatId', 'githubId', 'refreshTokens'];
    forbiddenFields.forEach(field => delete user[field]);
    successResponse(res, {
        user
    });
}

export default {
    getUserInfo,
    updateUserInfo
}