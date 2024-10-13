import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import AddJob from "../pages/AddJob";
import Login from "../pages/Authentication/Login";
import Registration from "../pages/Authentication/Registration";
import BidRequests from "../pages/BidRequests";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import JobDetails from "../pages/JobDetail";
import MyBids from "../pages/MyBids";
import MyPostedJobs from "../pages/MyPostedJob";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/login", element: <Login /> },
      { path: "/registration", element: <Registration /> },
      {
        path: "/job/:id",
        element: <JobDetails />,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`),
      },
      {
        path: "/add-job",
        element: <AddJob />,
      },
      {
        path: "/myposted-jobs",
        element: <MyPostedJobs />,
      },
      {
        path: "/my-bids",
        element: <MyBids />,
      },
      {
        path: "/bid-requests",
        element: <BidRequests />,
      },
    ],
  },
]);
