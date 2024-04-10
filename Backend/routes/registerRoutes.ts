import express from 'express'
import registerUser from '../controllers/registerController'

const registerRouter = express.Router()
registerRouter.route('/').post(registerUser)

export default registerRouter
