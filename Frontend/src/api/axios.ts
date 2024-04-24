import FingerprintJS from "@fingerprintjs/fingerprintjs"
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

const BASE_URL = "http://localhost:8080/api"
interface OngoingRequests {
  [key: string]: AbortController
}

// Custom type to extend AxiosRequestConfig with a custom field to track retries
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean // Custom property to indicate if the request has been retried
}

const getFingerprint = async () => {
  const fpPromise = await FingerprintJS.load()
  const fp = await fpPromise.get()
  return fp.visitorId
}

const logoutUser = async () => {
  try {
    const response = await axios.post("auth/logout", {
      fingerprint: await getFingerprint(),
    })
    console.log(response.data) // Logged out
  } catch (error) {
    console.error("Logout failed:", error)
  }
  localStorage.clear()
  sessionStorage.clear()
  // Redirect to login page
  window.location.href = "/login"
}

export function setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
  const ongoingRequests: OngoingRequests = {}
  axiosInstance.defaults.baseURL = BASE_URL
  axiosInstance.defaults.withCredentials = true
  axiosInstance.defaults.headers["Content-Type"] = "application/json"

  axiosInstance.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      const requestKey = `${request.method}-${request.url}`

      if (request.method === "POST") {
        request.data.fingerprint = await getFingerprint()
      }

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
    async (error: unknown) => {
      // Temporarily use 'any' to bypass type inference issues
      if (axios.isCancel(error)) {
        console.log("Error - Duplicate Request")
        return new Promise(() => {}) // Silently drop duplicate requests
      }

      if (error instanceof AxiosError) {
        // Type guard to ensure error is AxiosError
        if (
          error.response?.status === 401 &&
          !(error.config as ExtendedAxiosRequestConfig)._retry
        ) {
          // eslint-disable-next-line no-extra-semi
          ;(error.config as ExtendedAxiosRequestConfig)._retry = true
          //
          try {
            await axiosInstance.post("/auth/refresh")
            return axiosInstance(error.config as ExtendedAxiosRequestConfig) // Retry the original request with the new token
          } catch (error) {
            // Additional handling for refresh token errors
            await logoutUser()
            return Promise.reject(error)
          }
        }

        if (error.response?.status === 500) {
          console.log(error.response)
          // Additional handling for server errors
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}

export const axiosPrivate = setupInterceptors(axios)
