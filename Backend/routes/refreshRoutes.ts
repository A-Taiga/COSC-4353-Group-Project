import express from 'express'
import refreshToken from '../controllers/refreshController'

const refreshRouter = express.Router()

refreshRouter.route('/').post(refreshToken)

export default refreshRouter
