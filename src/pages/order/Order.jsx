import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext'
import Layout from '../../components/layout/Layout'
import Loader from '../../components/loader/Loader'
import { Tabs, TabPanel } from 'react-tabs';
import { fireDB, auth } from '../../firebase/FirebaseConfig';
import { addDoc, collection, doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Order() {
  const context = useContext(myContext)
  const { mode, loading } = context

  const [orderItems, setOrderItems] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      //console.log(userId);
      const userOrderRef = doc(fireDB, 'userOrders', userId);

      try {
        const userOrderDoc = await getDoc(userOrderRef);
        if (userOrderDoc.exists()) {
          const userOrderData = userOrderDoc.data();
          setOrderItems(userOrderData.orderItems);
        } else {
          // If user's cart document doesn't exist, set cart items to empty array
          setOrderItems([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderItems();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('orderedItem', JSON.stringify(orderItems))
  }, [orderItems])

  const deleteOrderedItem = async (item) => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userOrderRef = doc(fireDB, 'userOrders', userId);

    try {
      const userOrderDoc = await getDoc(userOrderRef);
      if (userOrderDoc.exists()) {
        const userOrderData = userOrderDoc.data();
        const updatedOrderItems = userOrderData.orderItems.filter((orderItem) => orderItem.id !== item.id);

        await setDoc(userOrderRef, { orderItems: updatedOrderItems });
        setOrderItems(updatedOrderItems);
        toast.success('Order Cancelled');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to Cancel The Order');
    }
  }

  return (
    <Layout>
      {loading && <Loader />}
      {orderItems.length > 0 ?
        (<>
          <div className=" h-full pt-10">
            <Tabs defaultIndex={0} data-aos="zoom-in" data-aos-duration="1000">
              <TabPanel>
                <div className='  px-4 md:px-0 mb-16'>
                  <div className="relative overflow-x-auto ">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                      <thead className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Image
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Mobile no.
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Address
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {orderItems.map((item, index) => (
                        <tbody key={index}>
                          <tr className="bg-gray-50 border-b dark:border-gray-700" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }} >

                            <td scope="row" className="px-6 py-4 font-medium text-black whitespace-nowrap">
                              <img onClick={() => window.location.href = `/productinfo/${item.id}`} className='w-16 hover:cursor-pointer' src={item.imageUrl} alt="img" />
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.title}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              ₹{item.updatedPrice}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.category}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.number}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.date}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.address}
                            </td>
                            <td className="px-10 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              <button className='text-green-700 font-semibold'>
                                Confirmed
                              </button>
                            </td>
                            <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              <button onClick={() => deleteOrderedItem(item)} className='bg-red-500 hover:bg-red-700'>
                                Cancel Order
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      ))

                      }

                    </table>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
            <div className="flex justify-end px-6 md:px-0 mb-4">
              <div>
                <button><Link className='text-blue-800 font-bold mr-4' to={'/allproducts'}>Continue Shopping...</Link></button>
              </div>
            </div>
          </div>
        </>)
        :
        (
          <div className='container mx-auto px-4 py-5 lg:py-8' data-aos="zoom-in" data-aos-duration="1000">
            <div className=' bg-pink-200 py-6 rounded-xl border border-pink-100'>
              <div className="flex flex-col items-center justify-center gap-4">
                <div>
                  <img className="mb-2 h-40 mt-1" src="https://cdn-icons-png.flaticon.com/128/11539/11539219.png" alt="" />
                </div>
                <h1 className="text-black text-xl mb-2 font-bold" >
                  Not Ordered Yet :
                  <button><Link className='font-bold ml-2 text-blue-700' to={'/cart'}>Place Order</Link></button>
                </h1>
              </div>
            </div>
          </div>

        )

      }
    </Layout>
  )
}

export default Order