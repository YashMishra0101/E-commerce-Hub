import React, { useContext } from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import moment from 'moment';
import Loader from '../../components/loader/Loader';
import { Link } from 'react-router-dom';

const Profile = () => {

  const context = useContext(myContext)
  const { mode, loading } = context

  const user = JSON.parse(localStorage.getItem('user'));
  let formattedDate;
  let formattedDate2;

  if (user) {
    // Convert the string timestamp to a number
    const timeStampNumber = parseInt(user.createdAt, 10); // Assuming base 10

    // Check if the conversion was successful
     formattedDate = !isNaN(timeStampNumber)
      ? moment(timeStampNumber).format('YYYY-MM-DD hh:mm:ss A')
      : 'Invalid Date';

    // Convert the string timestamp to a number
    const timeStampNumber2 = parseInt(user.lastLoginAt, 10); // Assuming base 10

    // Check if the conversion was successful
     formattedDate2 = !isNaN(timeStampNumber2)
      ? moment(timeStampNumber2).format('YYYY-MM-DD hh:mm:ss A')
      : 'Invalid Date';
  }

  return (
    <Layout>
      {loading && <Loader />}
      {user ? (
        <div className=" container mx-auto px-4 py-5 lg:py-8">
          {/* Top  */}
          <div className="top ">
            {/* main  */}
            <div className=" bg-pink-200 py-6 rounded-xl border border-pink-100" data-aos="zoom-in" data-aos-duration="1000">
              {/* image  */}
              <div className="flex justify-center mb-2 flex-shrink-0 overflow-hidden rounded-full">
                <img
                  src={user?.photoURL != "null" ? user.photoURL : "https://cdn-icons-png.flaticon.com/128/2202/2202112.png"}
                  alt=""
                  className='object-cover w-20 h-20'
                />
              </div>
              {/* text  */}
              <div className="">
                {/* Name  */}
                <h1 className=" text-center text-lg mb-2">
                  <span className=" font-bold">Name : </span>
                  {user?.displayName}
                </h1>

                {/* Email  */}
                <h1 className=" text-center text-lg mb-2">
                  <span className=" font-bold">Email : </span>
                  {user?.email}
                </h1>

                {/* Creation Date  */}
                <h1 className=" text-center text-lg mb-2">
                  <span className=" font-bold">Account createdAt : </span>
                  {formattedDate}
                </h1>

                {/* Last Login Date  */}
                <h1 className=" text-center text-lg mb-2">
                  <span className=" font-bold">Last LoginAt : </span>
                  {formattedDate2}
                </h1>

                {/* Role  */}
                <h1 className=" text-center text-lg mb-2">
                  <span className=" font-bold">Role : </span>
                  {user?.email === 'mr.shaktiranjansethy@gmail.com' ? "Admin" : "Customer"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='container mx-auto px-4 py-5 lg:py-8'>
          <div className=' bg-pink-200 py-6 rounded-xl border border-pink-100'>
            <div className="flex flex-col items-center justify-center gap-4">
              <div>
                <img className="mb-2 h-40 mt-1" src="https://cdn-icons-png.flaticon.com/128/16277/16277072.png" alt="" />
              </div>
              <h1 className="text-black text-xl mb-2 font-bold" >
                To Create Profile :
                <button><Link className='font-bold ml-2 text-red-700' to={'/signup'}>Signup</Link></button>
              </h1>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Profile