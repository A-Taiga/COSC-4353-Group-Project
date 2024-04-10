import express from 'express'
import profile from '../controllers/profileController'
import verifyTokens from '../middlewares/verifyToken'

const profileRouter = express.Router()

profileRouter.route('/').post(verifyTokens, profile)

export default profileRouter