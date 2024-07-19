import React, { useContext, useEffect } from 'react'
import Filter from '../../components/filter/Filter'
import ProductCard from '../../components/productCard/ProductCard'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart, increaseQuantity } from '../../redux/cartSlice'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fireDB, auth } from '../../firebase/FirebaseConfig';
import Category from '../../components/Category/Category'
import { FaStar } from "react-icons/fa";
import 'aos/dist/aos.css';
import AOS from 'aos';

function Allproducts() {
  const context = useContext(myContext)
  const { mode, product, searchkey, setSearchkey, filterType, setFilterType,
    filterPrice, setFilterPrice } = context

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animation in ms
      once: true,     // Whether animation should happen only once
    });
  }, []);

  const dispatch = useDispatch()
  // const cartItems = useSelector((state) => state.cart);
  //console.log(cartItems);

  const user = JSON.parse(localStorage.getItem('user'))

  const addCart = async (product) => {
    if (!user) {
      toast.error('Please Logged in First!')
    } else {

      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      const userCartRef = doc(fireDB, 'userCarts', userId);

      try {
        // Check if user's cart document exists
        const userCartDoc = await getDoc(userCartRef);
        if (!userCartDoc.exists()) {
          // If user's cart document doesn't exist, create it
          await setDoc(userCartRef, { cartItems: [{ ...product, quantity: 1 }] });
          toast.success('Product added to cart');
        } else {
          // If user's cart document exists, update it to add new product or increase quantity
          const userCartData = userCartDoc.data();
          const existingProductIndex = userCartData.cartItems.findIndex(item => item.id === product.id);
          if (existingProductIndex !== -1) {
            // If the product already exists in the cart, increase its quantity
            userCartData.cartItems[existingProductIndex].quantity += 1;
            toast.success('Quantity increased');
          } else {
            // If the product is not in the cart, add it with a quantity of 1
            userCartData.cartItems.push({ ...product, quantity: 1 });
            toast.success('Product added to cart');
            dispatch(addToCart(product));
          }
          await setDoc(userCartRef, { cartItems: userCartData.cartItems });
        }

      } catch (error) {
        console.log(error);
        toast.error('Failed to add product to cart');
      }
    }
  }

  const filterByPrice = (product, filterPrice) => {
    if (filterPrice === 'All') return true;
    const price = parseFloat(product.price.replace('₹', '').replace(',', ''));
    switch (filterPrice) {
      case 'Below ₹500':
        return price < 500;
      case '₹500 - ₹1000':
        return price >= 500 && price <= 1000;
      case '₹1000 - ₹2000':
        return price >= 1000 && price <= 2000;
      case 'Above ₹2000':
        return price > 2000;
      default:
        return true;
    }
  };

  return (
    <Layout>
      <Filter excludeFashion={false} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-8 md:py-16 mx-auto">
          <div class="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Our Latest Collection</h1>
            <div class="h-1 w-20 bg-pink-600 rounded -z-10 relative"></div>
          </div>

          <div className="flex flex-wrap -m-4 sm:space-x-18">
            <Category />
            {product
              .filter(obj => filterType === 'All' || obj.category.includes(filterType))
              .filter(obj => filterByPrice(obj, filterPrice))
              .map((item, index) => {
                const { title, price, originalPrice,discountPercentage, productRating, description, imageUrl, stocks, id } = item;
                return (
                  <div key={index} className="p-4 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full  drop-shadow-lg" data-aos="zoom-in" data-aos-duration="1000">
                    <div className={`h-full flex flex-col justify-between rounded-2xl overflow-hidden ${mode === 'dark' ? 'bg-gray-800 text-white hover:drop-shadow-2xl' : 'bg-white text-gray-900'} hover:shadow-lg transition-shadow duration-300 ease-in-out`}>
                      <div onClick={() => window.location.href = `/productinfo/${id}`} key={index} className="flex justify-center cursor-pointer">
                        <img className=" w-full h-64 object-cover object-center p-2 hover:scale-110 transition-scale-110 duration-300 ease-in-out" src={imageUrl} alt="product" />
                      </div>
                      <div className="p-5 border-t-2 flex flex-col h-49">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1" style={{ color: mode === 'dark' ? 'white' : '' }}>E-Bharat</h2>
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h1>
                        <p className="title-font text-sm font-medium text-gray-700 mb-2" style={{ color: mode === 'dark' ? 'gray' : '' }}>Total Stocks: {stocks}</p>
                        <div className="leading-relaxed mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>
                          {discountPercentage && (
                            <span className=" text-green-700 mr-2" ><span style={{ fontSize: '1.2em' }}>↓</span> {discountPercentage}%</span>
                          )}
                          {originalPrice && (
                            <span className="line-through text-gray-600 mr-2" >{originalPrice}</span>
                          )}
                          <span className='font-bold'>₹{price}</span>
                        </div>
                        <div className="title-font flex items-center gap-1 text-sm font-medium text-gray-700 mb-2" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                          <FaStar className="text-yellow-500" /> {productRating}
                        </div>
                        <div className="flex justify-center mt-auto">
                          <button onClick={() => addCart(item)} type="button" className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-purple-500 font-medium rounded-lg text-sm w-full py-2">Add To Cart</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      </section >
    </Layout>
  )
}

export default Allproducts