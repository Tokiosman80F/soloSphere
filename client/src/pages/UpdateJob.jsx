import { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { useLoaderData } from "react-router-dom"
import { AuthContext } from "../provider/AuthProvider";

const UpdateJob = () => {
    const job=useLoaderData()
    const {
        _id,
        category,
        deadline,
        description,
        job_title,
        max_price,
        min_price,
        buyer,
    } = job;
    const {user}=useContext(AuthContext)
    const [startDate, setStartDate] = useState(new Date(deadline).toLocaleDateString());
    
    const handleUpdateJobPost=async (e) =>{
        e.preventDefault();
    const form = e.target;
    const job_title = form.job_title.value;
    const email = form.email.value;
    const deadline = startDate;
    const category = form.category.value;
    const max_price = form.max_price.value;
    const min_price = form.min_price.value;
    const description = form.description.value;

    const updatedJobData = {
      job_title,
      deadline,
      category,
      max_price,
      min_price,
      description,
      buyer: {
        email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };
    console.log(updateJobData);

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/job/${id}`,
        updateJobData
      );
      alert("successfully updated a job");
    } catch (error) {
      console.log("Error in updating Job", error.message);
      alert("Failed to update the job. Please try again.");
    }
  };

    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
        <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
          <h2 className='text-lg font-semibold text-gray-700 capitalize '>
            Update a Job
          </h2>
  
          <form onSubmit={handleUpdateJobPost}>
            <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
              <div>
                <label className='text-gray-700 ' htmlFor='job_title'>
                  Job Title
                </label>
                <input
                  id='job_title'
                  name='job_title'
                  type='text'
                  value={job_title}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                />
              </div>
  
              <div>
                <label className='text-gray-700 ' htmlFor='emailAddress'>
                  Email Address
                </label>
                <input
                  id='emailAddress'
                  type='email'
                  name='email'
                  value={user?.email}
                  disabled
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                />
              </div>
              <div className='flex flex-col gap-2 '>
                <label className='text-gray-700'>Deadline</label>
  
              
                <DatePicker
                className="block w-full px-4 py-2  text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              </div>
  
              <div className='flex flex-col gap-2 '>
                <label className='text-gray-700 ' htmlFor='category'>
                  Category
                </label>
                <select
                  name='category'
                  id='category'
                  className='border p-2 rounded-md'
                  defaultValue={category}
                >
                  <option value='Graphics Design'>Graphics Design</option>
                  <option value='Web Development'>Web Development</option>
                  <option value='Digital Marketing'>Digital Marketing</option>
                </select>
              </div>
              <div>
                <label className='text-gray-700 ' htmlFor='min_price'>
                  Minimum Price
                </label>
                <input
                  id='min_price'
                  name='min_price'
                  type='number'
                  value={min_price}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                />
              </div>
  
              <div>
                <label className='text-gray-700 ' htmlFor='max_price'>
                  Maximum Price
                </label>
                <input
                  id='max_price'
                  name='max_price'
                  type='number'
                  value={max_price}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                />
              </div>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
              <label className='text-gray-700 ' htmlFor='description'>
                Description
              </label>
              <textarea
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                name='description'
                id='description'
                value={description}
                cols='30'
              ></textarea>
            </div>
            <div className='flex justify-end mt-6'>
              <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
                Save
              </button>
            </div>
          </form>
        </section>
      </div>
    )
  }
  
  export default UpdateJob