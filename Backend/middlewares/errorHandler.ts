import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

// Define a custom error handling middleware
const errorHandler = (
  error: ErrorRequestHandler, // The error object
  req: Request, // The incoming HTTP request
  res: Response, // The outgoing HTTP response
  next: NextFunction, // Function to call the next middleware
) => {
  // console.log(error)

  // Convert error message to lowercase for case-insensitive comparison
  const errorString = error.toString().toLowerCase()

  // Check if the error message includes specific error types and respond accordingly
  if (errorString.includes('not found'))
    // If error indicates a resource was not found, send a 404 response
    return res
      .status(404)
      .json({ message: 'Resource Not Found' })

  if (errorString.includes('forbidden'))
    // If access to a resource is forbidden, send a 403 response
    return res.status(403).json({ message: 'Forbidden' })

  if (errorString.includes('unauthorized'))
    // If request is unauthorized, send a 401 response
    return res.status(401).json({ message: 'Unauthorized' })

  if (errorString.includes('bad request'))
    // If the request was malformed or invalid, send a 400 response
    return res.status(400).json({ message: 'Bad Request' })

  if (errorString.includes('username taken'))
    // If the username is already taken, send a 409 response
    return res
      .status(409)
      .json({ message: 'Username Taken' })

  // For all other errors, send a 500 internal server error response
  return res
    .status(500)
    .json({ message: 'Internal Server Error' })
}

export default errorHandler
