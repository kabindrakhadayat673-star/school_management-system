import { indexSlice } from "./indexSlice";

export const teacherAPIS = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get all teacher
    getAllTeacher: builder.query({
      query: ({ page, limit }) => ({
        url: `/teacher/get-teacher?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["teacher"],
    }),
    // / ADD TEACHER
    addTeacher: builder.mutation({
      query: (data) => ({
        url: "/teacher/add-teacher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["teacher"],
    }),

    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `/teacher/delete-teacher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["teacher"],
    }),
    updateTeacher: builder.mutation({
      query: ({ id, data }) => ({
        url: `/teacher/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["teacher"],
    }),
  }),
});

export const {
  useGetAllTeacherQuery,
  useAddTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherAPIS;
