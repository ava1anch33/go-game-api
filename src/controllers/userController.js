import { userService } from "../services/index.js"
import { successResponse, checkUserExist } from '../utils/index.js';

async function getUserInfo(req, res, next) {
    try {
        const tokenUser = checkUserExist(req)
        const user = await userService.getUserById(tokenUser.id)
        successResponse(res, {
            user
        });
    } catch (error) {
        next(error)
    }
}

async function logout(req, res, next) {
    try {
        const currentUser = req.user;
        if (!currentUser) {
            return successResponse(res, { message: "ok" });
        }
        await userService.clearAllRefreshTokens(currentUser._id);
        successResponse(res, {
            message: "ok"
        });
    } catch (error) {
        next(error);
    }
}

async function updateUserInfo(req, res, next) {
    try {
        const { user: newUserInfo } = req.body
        const user = await userService.updateUser(newUserInfo)
        successResponse(res, {
            user
        });
    } catch (error) {
        next(error)
    }
}

export default {
    getUserInfo,
    updateUserInfo,
    logout
}