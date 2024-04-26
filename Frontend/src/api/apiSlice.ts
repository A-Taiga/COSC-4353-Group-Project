import FingerprintJS from "@fingerprintjs/fingerprintjs"
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react"
import axios from "axios"

const env = import.meta.env
const BASE_URL = `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/api`

interface ExtraOptions {
  attemptedRefresh?: boolean
}

const isAuthEndpoint = (url: string) => {
  return (
    url.includes("/login") ||
    url.includes("/register") ||
    url.includes("/refresh")
  )
}

const getFingerprint = async () => {
  const fpPromise = await FingerprintJS.load()
  const fp = await fpPromise.get()
  return fp.visitorId
}

const refreshAccessToken = async () => {
  // Call the refresh endpoint
  const fingperint = await getFingerprint()
  const response = await axios.post(
    `${BASE_URL}/refresh`,
    {
      fingerprint: fingperint,
    },
    { withCredentials: true }
  )
  console.log("Refresh token response:", response)

  return response
}

const logoutUser = async () => {
  try {
    await axios.post(
      `${BASE_URL}/auth/logout`,
      {
        fingerprint: await getFingerprint(),
      },
      { withCredentials: true }
    )
  } catch (error) {
    console.error("Logout failed:", error)
  }
  localStorage.clear()
  sessionStorage.clear()

  // Redirect to login page
  window.location.href = "/login"
}

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
})
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (
  args,
  api,
  extraOptions: ExtraOptions = { attemptedRefresh: false }
) => {
  // Ensure args is of type FetchArgs before proceeding
  if (typeof args === "string") args = { url: args } // Convert to FetchArgs if it's a string

  const result = await baseQuery(args, api, extraOptions)

  // If the initial request returns unauthorized and it's not an auth endpoint
  if (
    result.error &&
    result.error.status === 401 &&
    !isAuthEndpoint(args.url)
  ) {
    console.log("Attempting to refresh token")
    try {
      await refreshAccessToken()
      return await baseQuery(args, api, {
        ...extraOptions,
        attemptedRefresh: true,
      })
    } catch (refreshError) {
      console.error("Refresh token attempt failed:", refreshError)
      await logoutUser()
      return {
        error: {
          status: 403,
          data: "Session has expired after failed refresh attempt. Please log in again.",
        },
      }
    }
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Quotes"],
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ username, password, fingerprint }) => ({
        url: "auth/login",
        method: "POST",
        body: { username, password, fingerprint },
      }),
    }),
    upsertProfile: build.mutation({
      query: ({
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zipcode,
      }) => ({
        url: "/profile-management",
        method: "POST",
        body: { firstName, lastName, address1, address2, city, state, zipcode },
      }),
      invalidatesTags: ["Profile"],
    }),
    loadProfile: build.query({
      query: () => ({
        url: "/profile-management",
        method: "GET",
        providesTags: ["Profile"],
      }),
    }),
    register: build.mutation({
      query: ({ username, password }) => ({
        url: "auth/register",
        method: "POST",
        body: { username, password },
      }),
    }),
    submitQuote: build.mutation({
      query: ({
        gallonsRequested,
        deliveryDate,
        deliveryAddress,
        suggestedPrice,
        totalPrice,
      }) => ({
        url: "/fuelQuote",
        method: "POST",
        body: {
          gallonsRequested,
          deliveryDate,
          deliveryAddress,
          suggestedPrice,
          totalPrice,
        },
      }),
    }),
    getDeliveryAddress: build.query({
      query: () => ({
        url: "/fuelQuote/deliveryAddress",
        method: "GET",
        providesTags: ["Profile"],
      }),
    }),
    getPrice: build.mutation({
      query: ({ gallonsRequested, deliveryDate, deliveryAddress }) => ({
        url: "/pricing",
        method: "POST",
        body: { gallonsRequested, deliveryDate, deliveryAddress },
      }),
    }),
    getHisotyr: build.query({
      query: () => ({ url: "/fuelQuote/history", method: "GET" }),
    }),
    logout: build.mutation({
      query: ({ fingerprint }) => ({
        url: "/auth/logout",
        method: "POST",
        body: { fingerprint },
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useUpsertProfileMutation,
  useRegisterMutation,
  useLoadProfileQuery,
  useSubmitQuoteMutation,
  useGetDeliveryAddressQuery,
  useGetPriceMutation,
  useGetHisotyrQuery,
  useLogoutMutation,
} = apiSlice
