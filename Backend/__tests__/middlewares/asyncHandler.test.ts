import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../../middlewares/asyncHandler'

describe('asyncHandler', () => {
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

  it('should call the controller function with req, res, and next when next is provided', async () => {
    const mockData = { foo: 'bar' }
    const mockControllerFn = jest.fn().mockResolvedValue(mockData)
    const wrappedFn = asyncHandler(mockControllerFn)

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext)

    expect(mockControllerFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext)
  })

  it('should call the controller function with req and res when next is not provided', async () => {
    const mockData = { foo: 'bar' }
    const mockControllerFn = jest.fn().mockResolvedValue(mockData)
    const wrappedFn = asyncHandler(mockControllerFn)

    await wrappedFn(mockReq as Request, mockRes as Response, undefined as any)

    expect(mockControllerFn).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('should call next with the error when an error is thrown', async () => {
    const mockError = new Error('Test error')
    const mockControllerFn = jest.fn().mockRejectedValue(mockError)
    const wrappedFn = asyncHandler(mockControllerFn)

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext)

    expect(mockNext).toHaveBeenCalledWith(mockError)
  })
})
