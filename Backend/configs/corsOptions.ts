import allowedOrigins from './allowedOrigins'

type CorsCallback = (
  err: Error | null,
  allow?: boolean,
) => void

const corsOptions = {
  // take 2 arguments. "cors" middleware provide origin automatiacally. callback return null(no error) and true(request is allowed)
  origin: (
    requestOrigin: string | undefined,
    callback: CorsCallback,
  ) => {
    // (!== -1) means that only strings listed in allowedOrigins is passed through
    // (!origin) allows things like postman, or desktop application that don't provide an origin to access our RestAPI
    if (
      (requestOrigin &&
        allowedOrigins.indexOf(requestOrigin) !== -1) ||
      !requestOrigin
    ) {
      // call
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  // sets the access control allow credentials header
  credentials: true,
  // default is 204, but some devices like smartTVs, older browsers have trouble
  optionsSuccessStatus: 200,
}

export default corsOptions
