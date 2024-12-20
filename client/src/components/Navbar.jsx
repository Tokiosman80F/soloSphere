import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Navbar = () => {
  const { user, authSignOutUser } = useContext(AuthContext);
  const handleSignoutUser = () => {
    authSignOutUser()
      .then((result) => {
        console.log("Sign out successful:", result);
      })
      .catch((error) => {
        console.error("Failed to Logout:", error);
      });
  };
  return (
    <div className="navbar bg-base-100 shadow-sm container px-4 mx-auto">
      <div className="flex-1">
        <div className="flex gap-2 items-center">
          <img className="w-auto h-7" src="" alt="" />
          <span className="font-bold">SoloSphere</span>
        </div>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>

          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
        {user && (
          <div className="dropdown dropdown-end z-50">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full" title={user?.displayName}>
                <img
                  referrerPolicy="no-referrer"
                  alt="User Profile Photo"
                  src={user?.photoURL}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <Link to="/add-job">
                <div className="justify-between">Add Job</div>
              </Link>
              <Link to="/myposted-jobs">
                <div>My Posted Jobs</div>
              </Link>
              <Link to="/my-bids">
                <div>My Bids</div>
              </Link>
              <Link to="/bid-requests">
                <div>Bid Requests</div>
              </Link>
              <Link className="mt-2">
                <button
                  onClick={handleSignoutUser}
                  className="bg-gray-200 block text-center"
                >
                  Logout
                </button>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
