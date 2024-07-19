import React, { useState, useEffect, useContext } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';
import myContext from '../../context/data/myContext';
import Gif from "../../assets/mobile_bike.gif";
import AppStoreImg from "../../assets/app_store.png";
import PlayStoreImg from "../../assets/play_store.png";
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from "react-icons/fa";

const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

function Contact() {

    const context = useContext(myContext);
    const { mode, loading } = context;

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const [formData, setFormData] = useState({
        option: '',
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(fireDB, 'contactMessages'), formData);
            console.log('Document written with ID: ', docRef.id);
            // Reset form data
            setFormData({
                option: '',
                name: '',
                email: '',
                message: ''
            });
            toast.success("Form sent successfully!!")
        } catch (e) {
            console.error('Error adding document: ', e);
            toast.error("Form sent failed!")
        }
    };

    return (
        <Layout>
            {loading && <Loader />}
            <section className="hero-section">
                {/* Full-width map here */}
                <div className="map-container" style={{ height: '60vh', width: '100%', position: 'relative', zIndex: 1 }} data-aos="fade-up-down">
                    <MapContainer center={[20.9517, 85.0985]} zoom={7} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[20.9517, 85.0985]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </section>
            <section className="contact-section" style={{ paddingTop: '3rem', position: 'relative', zIndex: 2 }}>
                <div className="container px-5 py-6 md:py-10 mx-auto">
                    <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>
                            Contact Us
                        </h1>
                        <div className="h-1 w-20 bg-pink-600 rounded" data-aos="fade-up-right" data-aos-duration="500"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-44 gap-12">
                        <div className="contact-form" style={{ maxHeight: 'calc(80vh - 1rem)', overflowY: 'auto', paddingBottom: '2rem' }} data-aos="fade-up-right">
                            <div className="h-full flex flex-col justify-between rounded-2xl overflow-hidden bg-transparent text-gray-900 ">
                                <form onSubmit={handleSubmit} className="p-2 flex flex-col">
                                    <label className="mb-1 text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Select an Option</label>
                                    <select
                                        name="option"
                                        value={formData.option}
                                        onChange={handleChange}
                                        className="mb-4 p-2 border border-gray-300 rounded-lg"
                                        style={{ backgroundColor: mode === 'dark' ? '#475569' : '' }}
                                        required
                                    >
                                        <option value="">Choose an option</option>
                                        <option value="complain">Complain</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="enquiry">Enquiry</option>
                                        <option value="delayOrder">Delay Order</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <label className="mb-1 text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mb-4 p-2 border border-gray-300 rounded-lg"
                                        style={{ backgroundColor: mode === 'dark' ? '#475569' : '' }}
                                        required
                                    />
                                    <label className="mb-1 text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mb-4 p-2 border border-gray-300 rounded-lg"
                                        style={{ backgroundColor: mode === 'dark' ? '#475569' : '' }}
                                        required
                                    />
                                    <label className="mb-1 text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="mb-4 p-2 border border-gray-300 rounded-lg"
                                        style={{ backgroundColor: mode === 'dark' ? '#475569' : '' }}
                                        rows="5"
                                        required
                                    />
                                    <div style={{ marginBottom: '2rem' }}></div> {/* Spacer */}
                                    <button
                                        type="submit"
                                        className="mt-4 focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-purple-500 font-medium rounded-lg text-sm py-2"
                                        style={{ position: 'sticky', bottom: 0 }}
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="h-full flex flex-col justify-evenly sm:gap-7 rounded-2xl overflow-hidden bg-transparent text-gray-900 ">
                            <div
                                data-aos="fade-up"
                                data-aos-duration="300"
                                className="space-y-9 max-w-xl mx-auto"
                            >
                                <h1 className="text-2xl text-center sm:text-left sm:text-4xl font-extrabold" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                    E-Bharat is available for Android and IOS
                                </h1>
                                <div className="flex flex-wrap justify-center sm:justify-start items-center">
                                    <a href="#">
                                        <img
                                            src={PlayStoreImg}
                                            alt="Play store"
                                            className="max-w-[150px] sm:max-w-[120px] md:max-w-[200px]"
                                        />
                                    </a>
                                    <a href="#">
                                        <img
                                            src={AppStoreImg}
                                            alt="App store"
                                            className="max-w-[150px] sm:max-w-[120px] md:max-w-[200px]"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className='lg:mt-1 lg:-ml-10 lg:mr-24 mt-10' data-aos="zoom-in" data-aos-duration="300" >
                                <img
                                    src={Gif}
                                    alt="mobile bike"
                                    className="w-full sm:max-w-[60%] block rounded-md mx-auto mix-blend-multiply"
                                    style={{ color: mode === 'dark' ? 'mix-blend-difference' : '' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-10 ml-3' data-aos="fade-up-right">
                        <div className="flex items-center gap-3 text-xl" style={{ color: mode === 'dark' ? 'white' : '' }}>
                            <FaLocationArrow />
                            <p>Bhubaneswar,Odisha</p>
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-xl" style={{ color: mode === 'dark' ? 'white' : '' }}>
                            <FaMobileAlt />
                            <p>+91-6372667767</p>
                        </div>

                        <div className="flex items-center gap-3 mt-4 text-2xl" style={{ color: mode === 'dark' ? 'white' : '' }}>
                            <p>Follow Us at...</p>
                            <a href="#">
                                <FaInstagram className="text-3xl" />
                            </a>
                            <a href="#">
                                <FaFacebook className="text-3xl" />
                            </a>
                            <a href="#">
                                <FaLinkedin className="text-3xl" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default Contact;
