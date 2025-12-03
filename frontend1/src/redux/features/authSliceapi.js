import { indexSlice } from "./indexSlice";

export const authAPIS = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    signout: builder.mutation({
      query: () => ({
        url: `/auth/signout`,
        method: "post",
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});
export const { useSignoutMutation } = authAPIS;
