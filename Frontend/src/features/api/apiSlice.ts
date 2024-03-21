import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const env = import.meta.env

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/api`,
  }),
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ username, password, fingerprint }) => ({
        url: "auth/login",
        method: "POST",
        body: { username, password, fingerprint },
      }),
    }),
    profile: build.mutation({
      query: ({fullName, address1, address2, city, state, zipcode}) => ({
        url: "/profile-management",
        method: "POST",
        body: {fullName, address1, address2, city, state, zipcode},
      })
    }),
  }),
})



export const { useLoginMutation, useProfileMutation } = apiSlice
