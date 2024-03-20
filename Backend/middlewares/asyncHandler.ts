import { NextFunction, Request, Response } from 'express'

// Define a type for controller functions that may use next function
type ControllerFunction = (
  req: Request, // Incoming HTTP request
  res: Response, // Outgoing HTTP response
  next?: NextFunction, // Optional next function for middleware chaining
) => Promise<any> // Returns a promise of any type

// fn is the controller function
const asyncHandler =
  (
    fn: ControllerFunction, // Takes a controller function as argument
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Returns an async function
    try {
      // Execute controller function with provided arguments
      if (next) await fn(req, res, next)
      else await fn(req, res) // Call without next if not provided
    } catch (error) {
      // Pass any caught errors to the next error handling middleware
      return next(error)
    }
  }

// Export the asyncHandler for use in other modules
export default asyncHandler
