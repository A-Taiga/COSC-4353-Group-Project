import express from 'express'
import logoutUser from '../controllers/logoutController'

const logoutRouter = express.Router()

logoutRouter.route('/').post(logoutUser)

export default logoutRouter
