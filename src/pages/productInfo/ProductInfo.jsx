import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { addToCart, increaseQuantity } from '../../redux/cartSlice';
import { fireDB, auth } from '../../firebase/FirebaseConfig';
import Loader from "../../components/loader/Loader";

function ProductInfo() {
    const context = useContext(myContext);
    const { mode } = context;
    const { loading, setLoading } = context;

    const [products, setProducts] = useState('')
    const params = useParams()
    // console.log(products.title)

    const getProductData = async () => {
        setLoading(true)
        try {
            const productTemp = await getDoc(doc(fireDB, "products", params.id))
            // console.log(productTemp)
            const productWithId = { ...productTemp.data(), id: params.id }
            setProducts(productWithId);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    //console.log(products);
    useEffect(() => {
        getProductData()

    }, [])

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


    return (
        <Layout>
            <section className="text-gray-600 body-font overflow-hidden">
                {loading ?
                    <>
                        <div className="flex justify-center items-center">
                            <Loader />
                        </div>
                    </> :
                    <>
                        <div className="container px-5 py-10 mx-auto">
                            {products &&
                                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                                    <img
                                        alt="ecommerce"
                                        className="lg:w-1/3 w-full lg:h-auto  object-cover object-center rounded"
                                        src={products.imageUrl}
                                    />
                                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                                        <h2 className="text-sm title-font text-gray-500 tracking-widest" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                            BRAND NAME
                                        </h2>
                                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                            {products.title}
                                        </h1>
                                        <div className="flex mb-4">
                                            <span className="flex items-center" >
                                                <span className='font-bold mr-2' style={{ color: mode === 'dark' ? 'white' : '' }}>{products.productRating}</span>
                                                <svg
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    className="w-4 h-4 text-indigo-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                <svg
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    className="w-4 h-4 text-indigo-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                <svg
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    className="w-4 h-4 text-indigo-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                <svg
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    className="w-4 h-4 text-indigo-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    className="w-4 h-4 text-indigo-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>

                                            </span>
                                            <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                                                <a className="text-gray-500" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    <svg
                                                        fill="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        className="w-5 h-5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                                    </svg>
                                                </a>
                                                <a className="text-gray-500" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    <svg
                                                        fill="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        className="w-5 h-5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                                    </svg>
                                                </a>
                                                <a className="text-gray-500" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    <svg
                                                        fill="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        className="w-5 h-5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                        <p className="leading-relaxed mb-3  " style={{ color: mode === 'dark' ? 'gray' : '' }}>
                                            <span className='font-bold' style={{ color: mode === 'dark' ? 'white' : '' }}> Description:</span> {products.description}
                                        </p>
                                        <p className="leading-relaxed border-b-2  mb-5 pb-5" style={{ color: mode === 'gray' ? 'white' : '' }}>
                                            <span className='font-bold' style={{ color: mode === 'dark' ? 'white' : '' }}> Total stocks:</span> {products.stocks}
                                        </p>

                                        <div className="flex lg:flex-row flex-col">
                                            <div>
                                                {products.discountPercentage && (
                                                    <span className=" text-green-600 mr-2 text-2xl" >↓ {products.discountPercentage}%</span>
                                                )}
                                                {products.originalPrice && (
                                                    <span className="line-through text-gray-500 mr-2 text-2xl" >{products.originalPrice}</span>
                                                )}
                                                <span className="title-font font-medium text-2xl text-gray-900 ml-1" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    ₹{products.price}
                                                </span>
                                            </div>
                                            <button onClick={() => addCart(products)} className="flex lg:ml-auto mr-auto lg:mt-0 mt-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </>
                }
            </section>

        </Layout>
    )
}

export default ProductInfo