import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import errorHandler from '../../middlewares/errorHandler'

describe('errorHandler', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockReq = {}
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mockNext = jest.fn()
  })

  it('should respond with 404 if error includes "not found"', () => {
    const error: ErrorRequestHandler = (err, req, res, next) => {
      throw new Error('Resource not found')
    }

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(404)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Resource Not Found' })
  })

  it('should respond with 403 if error includes "forbidden"', () => {
    const error: ErrorRequestHandler = (err, req, res, next) => {
      throw new Error('Forbidden access')
    }
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Forbidden' })
  })

  it('should respond with 401 if error includes "unauthorized"', () => {
    const error: ErrorRequestHandler = (err, req, res, next) => {
      throw new Error('Unauthorized request')
    }
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('should respond with 400 if error includes "bad request"', () => {
    const error: ErrorRequestHandler = (err, req, res, next) => {
      throw new Error('Bad request error')
    }

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bad Request' })
  })

  it('should respond with 500 for any other error', () => {
    const error: ErrorRequestHandler = (err, req, res, next) => {
      throw new Error('Some other error')
    }

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    })
  })
})
