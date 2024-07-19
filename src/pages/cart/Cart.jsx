import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart, increaseQuantity, decreaseQuantity } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection, doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { fireDB, auth } from '../../firebase/FirebaseConfig';
import { Tabs, TabPanel } from 'react-tabs';
import { parse } from 'postcss';

function Cart() {

  const context = useContext(myContext)
  const { mode } = context;

  const dispatch = useDispatch()

  const user = JSON.parse(localStorage.getItem('user'))

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     if (!auth.currentUser) return;

  //     const userId = auth.currentUser.uid;
  //     //console.log(userId);
  //     const userCartRef = doc(fireDB, 'userCarts', userId);

  //     try {
  //       const userCartDoc = await getDoc(userCartRef);
  //       if (userCartDoc.exists()) {
  //         const userCartData = userCartDoc.data();
  //         setCartItems(userCartData.cartItems);
  //       } else {
  //         // If user's cart document doesn't exist, set cart items to empty array
  //         setCartItems([]);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchCartItems();
  // }, []);

  // console.log(cartItems);

  const fetchCartItems = async () => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const userCartRef = doc(fireDB, 'userCarts', userId);

    try {
      const userCartDoc = await getDoc(userCartRef);
      if (userCartDoc.exists()) {
        const userCartData = userCartDoc.data();
        setCartItems(userCartData.cartItems);

        // Calculate total amount
        let tempTotalAmount = 0;
        userCartData.cartItems.forEach((cartItem) => {
          tempTotalAmount += cartItem.price * cartItem.quantity;
        });
        setTotalAmount(tempTotalAmount);
      } else {
        // If user's cart document doesn't exist, set cart items to empty array
        setCartItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);


  let shipping;
  if (totalAmount > 500) {
    shipping = parseInt(0);
  } else {
    shipping = parseInt(100);
  }
  //console.log(shipping);
  const grandTotal = shipping + totalAmount

  // Delete to cart
  const deleteCart = async (item) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const userCartRef = doc(fireDB, 'userCarts', userId);
    // dispatch(deleteFromCart(item.id));

    try {
      const userCartDoc = await getDoc(userCartRef);
      if (userCartDoc.exists()) {
        const userCartData = userCartDoc.data();
        const updatedCartItems = userCartData.cartItems.filter((cartItem) => cartItem.id !== item.id);

        // Update user's cart document in Firestore to remove the deleted item
        await setDoc(userCartRef, { cartItems: updatedCartItems });

        // Update local state to reflect the change
        setCartItems(updatedCartItems);
        //dispatch(deleteFromCart({userId}))
        let tempTotalAmount = 0;
        updatedCartItems.forEach((cartItem) => {
          tempTotalAmount += cartItem.price * cartItem.quantity;
        });
        setTotalAmount(tempTotalAmount);
        toast.success('Product removed from cart');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove product from cart');
    }
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems])

  const increaseQuantityHandler = async (item) => {
    if (!auth.currentUser) return;

    dispatch(increaseQuantity(item)); // Dispatch action to increase quantity

    const userId = auth.currentUser.uid;
    const userCartRef = doc(fireDB, 'userCarts', userId);

    try {
      const userCartDoc = await getDoc(userCartRef);
      if (userCartDoc.exists()) {
        const userCartData = userCartDoc.data();
        const updatedCartItems = userCartData.cartItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        });

        // Update user's cart document in Firestore to update the quantity
        await setDoc(userCartRef, { cartItems: updatedCartItems });

        // Update local state to reflect the change
        setCartItems(updatedCartItems);

        let tempTotalAmount = 0;
        updatedCartItems.forEach((cartItem) => {
          tempTotalAmount += cartItem.price * cartItem.quantity;
        });
        setTotalAmount(tempTotalAmount);

      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update product quantity in cart');
    }
  };

  const decreaseQuantityHandler = async (item) => {
    if (!auth.currentUser) return;

    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item)); // Dispatch action to decrease quantity

      const userId = auth.currentUser.uid;
      const userCartRef = doc(fireDB, 'userCarts', userId);

      try {
        const userCartDoc = await getDoc(userCartRef);
        if (userCartDoc.exists()) {
          const userCartData = userCartDoc.data();
          const updatedCartItems = userCartData.cartItems.map((cartItem) => {
            if (cartItem.id === item.id) {
              return { ...cartItem, quantity: cartItem.quantity - 1 };
            }
            return cartItem;
          });

          // Update user's cart document in Firestore to update the quantity
          await setDoc(userCartRef, { cartItems: updatedCartItems });

          // Update local state to reflect the change
          setCartItems(updatedCartItems);

          // Recalculate total amount
          let tempTotalAmount = 0;
          updatedCartItems.forEach((cartItem) => {
            tempTotalAmount += cartItem.price * cartItem.quantity;
          });
          setTotalAmount(tempTotalAmount);

        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to update product quantity in cart');
      }
    }
  };



  /**========================================================================
  *!                           Payment Intigration
  *========================================================================**/

  const [name, setName] = useState("")
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const buyNow = async () => {
    if (name === "" || address == "" || pincode == "" || phoneNumber == "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }

    // const addressInfo = {
    //   name,
    //   address,
    //   pincode,
    //   phoneNumber,
    //   date: new Date().toLocaleString(
    //     "en-US",
    //     {
    //       month: "short",
    //       day: "2-digit",
    //       year: "numeric",
    //     }
    //   )
    // }



    var options = {
      key: "rzp_test_Yry2uVyxyR5WOb",
      key_secret: "wIS2s4TQRGiVBdbseIoPImYO",
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      order_receipt: 'order_rcptid_' + name,
      name: "E-Bharat",
      description: "for testing purpose",
      handler: async function (response) {
        console.log(response)
        toast.success('Payment Successful')

        const paymentId = response.razorpay_payment_id;

        // Get the currently logged-in user's ID
        const userId = auth.currentUser.uid;

        // Create an order document for the user
        const userOrderRef = doc(fireDB, 'userOrders', userId);
        try {
          const userOrderDoc = await getDoc(userOrderRef);
          let orderItems = [];

          // Check if user has existing orders
          if (userOrderDoc.exists()) {
            const userData = userOrderDoc.data();
            // Append new order items to existing order items
            orderItems = userData.orderItems || [];
          }

          cartItems.forEach(cartItem => {
            orderItems.push({
              ...cartItem,
              updatedPrice: totalAmount,
              name: name,
              address: address,
              number: phoneNumber,
              PaymentId: paymentId,
              date: new Date().toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }
              )
            });
          });

          // Update the user's order document with the updated order items array
          await setDoc(userOrderRef, {
            orderItems: orderItems
          });

          // Clear the cart after placing the order
          // Optionally, you can remove this if you want to keep items in the cart after placing an order
          // setCartItems([]);
          // setTotalAmount(0);

          // Show success message
          toast.success('Order placed successfully');
        } catch (error) {
          console.log(error);
          toast.error('Failed to place order');
        }
      },

      theme: {
        color: "#3399cc"
      }
    };

    var pay = new window.Razorpay(options);
    pay.open();
    console.log(pay)
  }

  return (
    <Layout >
      {user ?
        (<>
          <div className="min-h-full bg-gray-100 pt-5" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }} >
            <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:flex-col lg:flex lg:flex-row md:space-x-5 xl:px-0 gap-2 ">
              <Tabs data-aos="zoom-in" data-aos-duration="1000">
                <TabPanel>
                  <div className='  px-4 md:px-0 mb-16'>
                    <div className="relative overflow-x-auto ">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                        <thead className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              S.No
                            </th>
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
                              Stocks
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        {cartItems.map((item, index) => {
                          return (
                            <tbody className=''>
                              <tr className="bg-gray-50 border-b  dark:border-gray-700" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                                <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                  {index + 1}.
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-black whitespace-nowrap">
                                  <img onClick={() => window.location.href = `/productinfo/${item.id}`} key={index} className='w-16 hover:cursor-pointer' src={item.imageUrl} alt="img" />
                                </th>
                                <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                  {item.title}
                                </td>
                                <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                  ₹{item.price}
                                </td>
                                <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                  {item.category}
                                </td>
                                <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                  {item.stocks}
                                </td>
                                <td>
                                  <div class="productQuantityElement mt-2 ml-2">
                                    <div class="stockElement">
                                      <button onClick={() => decreaseQuantityHandler(item)} class="cartDecrement h-6 w-6 border-2 border-black text-black hover:bg-pink-600  transition-colors duration-200" style={{ borderColor: mode === 'dark' ? 'white' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        -
                                      </button>
                                      <span class="productQuantity py-0 px-3 text-black text-md font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.quantity}</span>
                                      <button onClick={() => increaseQuantityHandler(item)} class="cartIncrement h-6 w-6 border-2 border-black text-black hover:bg-pink-600 transition-colors duration-200" style={{ borderColor: mode === 'dark' ? 'white' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className=" flex gap-2">
                                    <div className=" flex gap-2 cursor-pointer text-black ml-4 " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                      <div onClick={() => deleteCart(item)}  >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>

                            </tbody>
                          )
                        })}
                      </table>

                    </div>
                  </div>
                </TabPanel>
              </Tabs>

              <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3 mb-5" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }} data-aos="zoom-in" data-aos-duration="1000">
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Subtotal</p>
                  <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{totalAmount}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Shipping</p>
                  <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{shipping}</p>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between mb-3">
                  <p className="text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>Total</p>
                  <div className>
                    <p className="mb-1 text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{grandTotal}</p>
                  </div>
                </div>
                {/* <Modal  /> */}
                <Modal
                  name={name}
                  address={address}
                  pincode={pincode}
                  phoneNumber={phoneNumber}
                  setName={setName}
                  setAddress={setAddress}
                  setPincode={setPincode}
                  setPhoneNumber={setPhoneNumber}
                  buyNow={buyNow}
                />
              </div>
            </div>
          </div>
        </>)
        :
        (
          <div className='container mx-auto px-4 py-5 lg:py-8'>
            <div className=' bg-pink-200 py-6 rounded-xl border border-pink-100'>
              <div className="flex flex-col items-center justify-center gap-4">
                <div>
                  <img className="mb-2 h-40 mt-1" src="https://cdn-icons-png.flaticon.com/128/3494/3494354.png" alt="" />
                </div>
                <h1 className="text-black text-xl mb-2 font-bold" >
                  Please Login/Signup first :
                  <button><Link className='font-bold ml-2 text-red-700' to={'/signup'}>Signup</Link></button>
                  <button><Link className='font-bold ml-2 text-green-700' to={'/login'}>Login</Link></button>
                </h1>
              </div>
            </div>
          </div>
        )
      }
    </Layout>
  )
}

export default Cart