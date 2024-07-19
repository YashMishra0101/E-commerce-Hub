import React, { useContext } from "react";
import BannerImg from "../../assets/women2.jpg";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import myContext from '../../context/data/myContext';

const Banner = () => {
    const context = useContext(myContext)
    const { mode } = context
    return (
        <div className="min-h-[550px] flex justify-center items-center py-12 sm:py-0">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* image section */}
                    <div data-aos="zoom-in">
                        <img
                            src={BannerImg}
                            alt=""
                            className="lg:max-w-[400px] lg:h-[350px] max-w-[300px] h-[250px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)] object-cover"

                        />
                    </div>

                    {/* text details section */}
                    <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:pl-4 pl-7">
                        <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>
                            Top Sale - Upto 50% Off
                        </h1>
                        <p
                            data-aos="fade-up"
                            className="text-sm text-gray-500 tracking-wide leading-5"
                            style={{ color: mode === 'dark' ? 'white' : '' }}
                        >
                           Discover incredible savings with our exclusive Top Sale event, offering discounts of up to 50% on a wide range of products. Whether you're looking for the latest electronics, stylish fashion, home essentials, or unique gifts, this sale has something for everyone. Don't miss out on the chance to grab high-quality items at unbeatable prices. Hurry, these deals won't last long! Shop now and take advantage of our top sale to enjoy significant savings on your favorite products.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div data-aos="fade-up" className="flex items-center gap-4">
                                <GrSecure className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }}>Quality Products</p>
                            </div>
                            <div data-aos="fade-up" className="flex items-center gap-4">
                                <IoFastFood className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }}>Fast Delivery</p>
                            </div>
                            <div data-aos="fade-up" className="flex items-center gap-4">
                                <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-green-100 dark:bg-green-400" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }}>Easy Payment method</p>
                            </div>
                            <div data-aos="fade-up" className="flex items-center gap-4">
                                <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-yellow-100 dark:bg-yellow-400" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }}>Get Offers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;