import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const env = import.meta.env

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/api`,
  }),
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = apiSlice