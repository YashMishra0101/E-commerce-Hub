import React, { useContext } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import myContext from '../../context/data/myContext';

const skillsData = [
    {
        name: "Excellent Service",
        icon: (
            <FaCameraRetro className="text-5xl text-primary group-hover:text-black duration-300" />
        ),
        link: "#",
        description: "E-Bharat store is committed to providing excellent services to our customers. From prompt assistance with inquiries to efficient handling of orders and deliveries,  we prioritize your satisfaction every step on the way.",
        aosDelay: "0",
    },
    {
        name: "Quality Assurance",
        icon: (
            <GiNotebook className="text-5xl text-primary group-hover:text-black duration-300" />
        ),
        link: "#",
        description: "Every gadget at Thapa Store undergoes rigorous quality checks, guaranteeing, reliability and performance, so you can shop with confidence knowing you're getting the best.",
        aosDelay: "500",
    },
    {
        name: "Convenient Shopping",
        icon: (
            <SlNote className="text-5xl text-primary group-hover:text-black duration-500" />
        ),
        link: "#",
        description: " With E-Bharat Store, shopping for gadgets is convenient. Our user-friendly website and secure payment options ensure a seamless experience from browsing to checkout, all from the comfort of your home",
        aosDelay: "1000",
    },
];
const Services = () => {

    const context = useContext(myContext);
    const { mode } = context;

    return (
        <>
            <span id="about"></span>
            <div className=" py-10 mt-10 sm:min-h-[450px] sm:grid sm:place-items-center" style={{ color: mode === 'dark' ? 'white' : '', }}>
                <div className="container">
                    <div className="lg:pb-12 pb-7">
                        <h1
                            data-aos="fade-up"
                            className="text-3xl font-semibold text-center sm:text-4xl font-serif"
                        >
                            Why Choose Us
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 m-4">
                        {skillsData.map((skill) => (
                            <div
                                key={skill.name}
                                data-aos="fade-up"
                                data-aos-delay={skill.aosDelay}
                                className={`card text-center group space-y-2 sm:space-y-4 p-2 sm:py-8 duration-300 rounded-lg ${mode === 'dark'
                                    ? 'bg-gray-500 text-black hover:bg-pink-600'
                                    : 'bg-gray-900 text-white hover:bg-pink-600'
                                    }`}

                            >
                                <div className="grid place-items-center">{skill.icon}</div>
                                <h1 className="text-2xl font-bold">{skill.name}</h1>
                                <p>{skill.description}</p>
                                <a
                                    href={skill.link}
                                    className="inline-block text-lg font-semibold  group-hover:text-black duration-300"
                                >
                                    Learn more
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;