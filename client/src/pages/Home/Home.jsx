import { useLoaderData } from "react-router-dom";
import TabCategories from "../../components/TabCategories";

const Home = () => {
  const jobs = useLoaderData();
  console.log(jobs);

  return (
    <div>
      <div>This Home page </div>
      <TabCategories></TabCategories>
    </div>
  );
};

export default Home;
