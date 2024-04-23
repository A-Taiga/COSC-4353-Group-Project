import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const env = import.meta.env

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/api`,
    credentials: "include",
  }),

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
    }),
    loadProfile: build.query({
      query: () => ({ url: "/profile-management", method: "GET" }),
    }),
    register: build.mutation({
      query: ({ username, password }) => ({
        url: "auth/register",
        method: "POST",
        body: { username, password },
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useUpsertProfileMutation,
  useRegisterMutation,
  useLoadProfileQuery,
} = apiSlice
