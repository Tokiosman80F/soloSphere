import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const {
    _id,
    category,
    deadline,
    description,
    job_title,
    max_price,
    min_price,
  } = job;
  return (
    <article className="w-full max-w-sm px-4 py-3 bg-white border-2 rounded-md shadow-md ">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800 ">
          {deadline || `N?A`}
        </span>
        <span className="px-3 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full ">
          {category}
        </span>
      </div>

      <div>
        <h1 className="mt-2 text-lg font-semibold text-gray-800 ">
          {job_title}
        </h1>
        <p className="my-4 text-sm text-gray-600 ">
          {description || `No description available.`}
        </p>
      </div>

      <div className="flex justify-between">
        {min_price && max_price ? (
          <div className="flex items-center mt-2 text-gray-700 gap-2">
            <span>Salary :</span>
            <span>{min_price}</span>
            <span> - </span>
            <span>{max_price}</span>
          </div>
        ) : (
          <p className="mt-2 text-gray-600">
            Salary Infomation is not avaiable
          </p>
        )}
        <div>
          <Link
            to={`/job/${_id}`}
            className="text-[14px] px-2 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          >
            View Detail
          </Link>
        </div>
      </div>
    </article>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string,
    category: PropTypes.string.isRequired,
    deadline: PropTypes.string,
    description: PropTypes.string,
    job_title: PropTypes.string.isRequired,
    max_price: PropTypes.number,
    min_price: PropTypes.number,
  }).isRequired,
};

export default JobCard;
