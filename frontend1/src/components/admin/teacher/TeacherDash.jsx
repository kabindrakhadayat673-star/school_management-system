import React, { useState } from "react";
import {
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useGetAllTeacherQuery,
  useUpdateTeacherMutation,
} from "../../../redux/features/teacherSlice";
import Loading from "../../shared/loading";
import { toast } from "react-toastify";
import { Pagination } from "../../shared/Pagination";

const initialData = {
  name: "",
  email: "",
  position: "",
  phone: "",
  image: "",
};

const TeacherDash = () => {
  const [isMoalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState();
  const [originalData, setOriginalData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormdata] = useState(initialData);
  const [page, setpage] = useState(1);
  const { data, isLoading, error } = useGetAllTeacherQuery({
    page,
    limit: 2,
  });

  const [deleteTeacher] = useDeleteTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [AddTeacher] = useAddTeacherMutation();

  const totalpages = data?.totalPages || 1;
  if (isLoading) {
    return <Loading />;
  }
  if (error) return <p className="p-4 text-red-600">Failed to load</p>;
  console.log(data);

  const teachers = data?.teacher;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handelADDTeacher = () => {
    setIsModalOpen(true);
    setIsAdding(true);
    setTeacherId(null);
    setOriginalData({});
    setFormdata(initialData);
  };

  const handleDelete = async (teacher) => {
    // console.log(teacher.id);
    // toast.error("hey");
    try {
      await deleteTeacher(teacher.id).unwrap(); // for use state
      //await deleteTeacher(teacher.id).unwrap(); // for  direct api call.
      toast.success("teacher deleted succesfully");
    } catch (error) {
      toast.error("failed to delete teacher", error);
    }
  };

  const handleEdit = (teacher) => {
    setIsModalOpen(true);
    setIsAdding(false);
    setTeacherId(teacher.id);
    setOriginalData(teacher);
    // setSelectedTeacher(teacher);
    setFormdata({
      name: teacher.name,
      email: teacher.email,
      possition: teacher.possition,
      phone: teacher.phone,
      image: teacher.img,
    });
    // toast.error("hey ");
  };

  const handleFileChange = (e) => {
    setFormdata((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      const multerData = new FormData();
      multerData.append("name", formData.name);
      multerData.append("email", formData.email);
      multerData.append("position", formData.position);
      multerData.append("phone", formData.phone);

      // Image file must be appended as a file
      if (formData.image) {
        multerData.append("image", formData.image);
      }

      try {
        const res = await AddTeacher(formData).unwrap();
        toast.success(res.message || "Teacher added successfully!!!");
        setFormdata(initialData);
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.data?.message || "Failed to add teacher");
      }
      return;
    }
    let updatedData = new FormData();

    if (formData.name !== originalData.name) {
      updatedData.append("name", formData.name);
    }

    if (formData.email !== originalData.email) {
      updatedData.append("email", formData.email);
    }

    if (formData.position !== originalData.position) {
      updatedData.append("position", formData.position);
    }

    if (formData.phone !== originalData.phone) {
      updatedData.append("phone", formData.phone);
    }

    // If image changed
    if (formData.image instanceof File) {
      updatedData.append("image", formData.image);
    }

    if ([...updatedData.keys()].length === 0) {
      toast.info("No changes made");
      return;
    }

    try {
      const res = await updateTeacher({
        id: teacherId,
        data: updatedData,
      }).unwrap();
      console.log(res);
      toast.success(res.message || "Teacher updated Successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update teacher");
      console.log(error?.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Teachers List</h1>
        <button
          onClick={handelADDTeacher}
          className="cursor-pointer bg-blue-700 text-white px-3 rounded-full"
        >
          Add Teacher
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                IMAGE
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {teachers?.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">
                  <img
                    src={`${import.meta.env.VITE_IMG_URL}${teacher.img}`}
                    alt={teacher.img ? teacher.name : "No Image"}
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {teacher.position}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {teacher.phone}
                </td>
                <td>
                  <div className="space-x-4">
                    <button
                      onClick={() => handleDelete(teacher)}
                      className="cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalpages}
          onPagechange={setpage}
        />

        {teachers?.length === 0 && (
          <p className="p-4 text-center text-gray-500">No teacher data found</p>
        )}
      </div>
      {isMoalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add" : "Edit"} Teacher
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                value={formData?.name || ""}
                type="text"
                id="name"
                placeholder="Name"
                className="w-full p-2 border rounded mb-3"
                onChange={handleChange}
              />
              <input
                value={formData?.email || ""}
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 border rounded mb-3"
                onChange={handleChange}
              />
              <input
                value={formData?.position || ""}
                type="text"
                id="position"
                placeholder="Position"
                className="w-full p-2 border rounded mb-3"
                onChange={handleChange}
              />
              <input
                value={formData?.phone || ""}
                type="text"
                id="phone"
                placeholder="Phone"
                className="w-full p-2 border rounded mb-3"
                onChange={handleChange}
              />
              {!isAdding && formData.image ? (
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${formData.image}`}
                  alt={formData.name}
                />
              ) : null}

              <input
                type="file"
                id="image"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={isAdding}
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className=" cursor-pointer px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className=" cursor-pointer px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isAdding ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDash;
