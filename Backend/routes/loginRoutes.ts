import express from 'express'
import loginUser from '../controllers/loginController'

const loginRouter = express.Router()

loginRouter.route('/').post(loginUser)

export default loginRouter
