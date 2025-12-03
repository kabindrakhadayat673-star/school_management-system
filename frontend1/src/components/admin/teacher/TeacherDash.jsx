import React, { useState } from "react";
import {
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useGetAllTeacherQuery,
  useUpdateTeacherMutation,
} from "../../../redux/features/teacherSlice";
import Loading from "../../shared/loading";
import { toast } from "react-toastify";

const initialData = {
  name: "",
  email: "",
  position: "",
  phone: "",
};

const TeacherDash = () => {
  const [isMoalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState();
  const [originalData, setOriginalData] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormdata] = useState(initialData);

  const { data, isLoading, error } = useGetAllTeacherQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [AddTeacher] = useAddTeacherMutation();
  if (isLoading) {
    return <Loading />;
  }
  if (error) return <p className="p-4 text-red-600">Failed to load</p>;
  console.log(data);

  const teachers = data?.data;

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
    });
    // toast.error("hey ");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
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
    const changedData = {};
    if (formData.name !== originalData.name) {
      changedData.name == formData.name;
    }
    if (formData.email !== originalData.email) {
      changedData.email == formData.email;
    }
    if (formData.position !== originalData.position) {
      changedData.position == formData.position;
    }
    if (formData.position !== originalData.position) {
      changedData.position == formData.position;
    }
    if (formData.phone !== originalData.phone) {
      changedData.phone == formData.phone;
    }
    if (Object.key(changedData).length === 0) {
      toast.info("No change made");
      return;
    }

    try {
      const res = await updateTeacher({
        id: teacherId,
        data: changedData,
      }).unwarp();

      toast.success(res.message || " update teacher succesfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.Data?.message || "failed to update teacher", error);
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
                ID
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
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {teacher.id}
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

        {teachers.length === 0 && (
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
