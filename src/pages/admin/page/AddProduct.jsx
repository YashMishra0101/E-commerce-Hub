import React, { useContext } from 'react'
import myContext from '../../../context/data/myContext'

function AddProduct() {
    const context = useContext(myContext);
    const { products, setProducts, addProduct } = context
    return (
        <div>
            <div className=' flex justify-center items-center h-screen'>
                <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                    <div className="">
                        <h1 className='text-center text-white text-xl mb-4 font-bold'>Add Product</h1>
                    </div>
                    <div>
                        <input type="text"
                            onChange={(e) => setProducts({ ...products, title: e.target.value })} value={products.title}
                            name='title'
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product title'
                        />
                    </div>
                    <div>
                        <input type="number"
                            name='price'
                            onChange={(e) => setProducts({ ...products, price: e.target.value })} value={products.price}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product price'
                        />
                    </div>
                    <div>
                        <input type="number"
                            name='originalPrice'
                            onChange={(e) => setProducts({ ...products, originalPrice: e.target.value })} value={products.originalPrice}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='ProductOriginal price'
                        />
                    </div>
                    <div>
                        <input type="number"
                            name='discountPercentage'
                            onChange={(e) => setProducts({ ...products, discountPercentage: e.target.value })} value={products.discountPercentage}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Discount Percentage'
                        />
                    </div>
                    <div>
                        <input type="number"
                            name='productRating'
                            onChange={(e) => setProducts({ ...products, productRating: e.target.value })} value={products.productRating}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product rating'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='imageurl'
                            onChange={(e) => setProducts({ ...products, imageUrl: e.target.value })} value={products.imageUrl}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product imageUrl'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='category'
                            onChange={(e) => setProducts({ ...products, category: e.target.value })} value={products.category}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product category'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='stocks'
                            onChange={(e) => setProducts({ ...products, stocks: e.target.value })} value={products.stocks}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Total Available'
                        />
                    </div>
                    <div>
                        <textarea cols="30" rows="10"
                            name='description' onChange={(e) => setProducts({ ...products, description: e.target.value })}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product description'>

                        </textarea>
                    </div>
                    <div className=' flex justify-center mb-3'>
                        <button
                            onClick={addProduct}
                            className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                            Add Product
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddProduct