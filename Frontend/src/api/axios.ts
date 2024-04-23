import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

interface OngoingRequests {
  [key: string]: AbortController
}

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  const ongoingRequests: OngoingRequests = {}
  axiosInstance.defaults.baseURL = "https://localhost:8080/api"

  axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
      request.headers!["Content-Type"] = "application/json"

      const requestKey = `${request.method}-${request.url}`

      if (ongoingRequests[requestKey]) {
        const controller = ongoingRequests[requestKey]
        controller.abort("Repeated Operation")
      }

      const controller = new AbortController()
      ongoingRequests[requestKey] = controller

      return {
        ...request,
        signal: controller.signal,
      }
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const requestKey = `${response.config.method}-${response.config.url}`

      if (ongoingRequests[requestKey]) {
        delete ongoingRequests[requestKey]
      }

      return response
    },
    (error: unknown) => {
      if (axios.isCancel(error)) {
        console.log("Error - Duplicate Request")
        // Drop the previous request silently
        return new Promise(() => {})
      }

      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 500) {
          console.log(error.response)
          // window.location.href = '/unavailable'
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}

export const axiosInst = setupInterceptorsTo(axios)
