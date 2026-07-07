import { BASE_URL } from "@/lib/APIROTES";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const colorGameApi = createApi({
    reducerPath: "colorGameApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/color-game`,
        credentials: "include"
    }),

    endpoints: (builder) => ({
        getCurrentRound: builder.query({
            query: () => "/current-round"
        }),
        getResult: builder.query({
            query: (id) => `/result/${id}`
        }),
        getMyResult: builder.query({
            query: (id) => `/my-result/${id}`
        }),

        getMyActiveBet: builder.query({
            query: () => "/active-bet"
        }), 

        placeBet: builder.mutation({
            query: (options) => ({
                url: "/place-bet",
                method: "POST",
                body: options
            })
        })
    })
})

export const { useGetCurrentRoundQuery, useLazyGetMyResultQuery,useLazyGetCurrentRoundQuery, usePlaceBetMutation, useLazyGetResultQuery, useGetMyActiveBetQuery } = colorGameApi;