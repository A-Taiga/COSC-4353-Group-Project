import express from 'express'
import profile from '../controllers/profileController'

const profileRouter = express.Router()

profileRouter.route('/').post(profile)

export default profileRouter