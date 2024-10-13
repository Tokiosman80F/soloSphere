import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import JobCard from "./JobCard";

const TabCategories = () => {
  const [jobs, setJobs] = useState([]);

  // Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`
        );
        setJobs(data);
      } catch (error) {
        console.log("Error in fatching data :", error);
      }
    };
    getData();
  }, []);

  //  Filtering job based on category
  const webDevelopment = jobs.filter(
    (job) => job.category === "Web Development"
  );
  const graphic = jobs.filter((job) => job.category === "Graphics Design");
  const digitaMarketing = jobs.filter(
    (job) => job.category === "Digital Marketing"
  );

  return (
    <div>
      <Tabs>
        <div className="flex justify-center">
          <TabList>
            <Tab>Web </Tab>
            <Tab>Graphic</Tab>
            <Tab>Digital Market</Tab>
          </TabList>
        </div>

        <TabPanel className="border-2">
          <div className="grid grid-cols-3 gap-7 mx-5 my-5">
            {webDevelopment.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-3 gap-7 mx-5 my-5">
            {graphic.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-3 gap-7 mx-5 my-5">
            {digitaMarketing.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

// PropTypes For validation of jobs props
TabCategories.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TabCategories;
