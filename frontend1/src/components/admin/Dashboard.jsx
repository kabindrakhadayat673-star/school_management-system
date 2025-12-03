import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/authState";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSignoutMutation } from "../../redux/features/authSliceapi";

const Dashboard = () => {
  const { email, isAuth } = useSelector((state) => state.user);
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const [signout] = useSignoutMutation();

  useEffect(() => {
    if (!isAuth) {
      navigate("/not-found");
    }
  });
  [isAuth];

  const handlelogout = async () => {
    Dispatch(logout());
    try {
      const res = await signout().unwrap();
      toast.success(res.message || "Logged out Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.data?.message || "Logout failed");
    }
  };
  return (
    <div className="h-screen flex">
      {/* first section */}
      <div className="bg-red-950">
        <Link
          to="/dashboard/teacher"
          className="text-white text-x1 p-2 bg-amber-300 m-2 rounded-md"
        >
          Add Teacher
        </Link>
      </div>

      {/* Second div */}
      <div className="flex mx-auto justify-center items-center ">
        <div className="text-center">
          <h1 className="font-bold text-3xl">Welcome {email}</h1>
          <button onClick={handlelogout} className="text-pink-500">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
