import { useNavigate, useParams } from "react-router";
import Layout from '../../components/layout/Layout'
import { useContext, useEffect } from "react";
import myContext from '../../context/data/myContext';
import Loader from '../../components/loader/Loader'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity } from '../../redux/cartSlice'
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { fireDB, auth } from '../../firebase/FirebaseConfig'
import { FaStar } from "react-icons/fa";
import 'aos/dist/aos.css';
import AOS from 'aos';

const CategoryPage = () => {
    const { category } = useParams();
    const context = useContext(myContext);
    const { product, loading, mode } = context;

    useEffect(() => {
        AOS.init({
            duration: 1000, // Duration of animation in ms
            once: true,     // Whether animation should happen only once
        });
    }, []);


    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const filterProduct = product.filter((obj) => obj.category.toLowerCase().includes(category.toLowerCase()))
    //console.log(filterProduct);

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

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
                        // dispatch(addToCart({userId,product}));
                    }
                    await setDoc(userCartRef, { cartItems: userCartData.cartItems });
                }

            } catch (error) {
                console.log(error);
                toast.error('Failed to add product to cart');
            }
        }
    }

    // console.log(cartItems)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])


    return (
        <Layout>
            <div className="mt-10">
                {/* Heading  */}
                <div className="flex justify-center items-center" data-aos="zoom-in">
                    <h1 className=" text-center mb-5 text-3xl font-bold first-letter:uppercase inline-block border-b-2 border-gray-500" style={{ color: mode === 'dark' ? 'white' : '', }}>{category}</h1>
                </div>

                {/* main  */}
                {loading ?
                    <>
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                    </>
                    :
                    <>
                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-5 mx-auto ">
                                <div className="flex flex-wrap -m-4  justify-center">
                                    {filterProduct.length > 0
                                        ?

                                        <>
                                            {filterProduct.map((item, index) => {
                                                const { id, title, price, originalPrice, discountPercentage,productRating, imageUrl, stocks } = item
                                                //console.log(filterProduct);
                                                return (
                                                    <div key={index} className="p-4 lg:w-1/4 md:w-1/3 sm:w-1/2 drop-shadow-lg" data-aos="zoom-in">
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
                                                )
                                            })}
                                        </>

                                        :

                                        <div>
                                            <div className="flex justify-center">
                                                <img className=" mb-2" src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png" alt="" />
                                            </div>
                                            <h1 className=" text-black text-xl" style={{ color: mode === 'dark' ? 'white' : '' }}>No {category} product found</h1>
                                        </div>
                                    }
                                </div>
                            </div>
                        </section>
                    </>
                }
            </div>
        </Layout>
    );
}

export default CategoryPage;