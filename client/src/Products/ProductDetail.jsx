import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import EnquiryModal from '../Modals/Enquiry';

const ProductDetail = () => {
    const location = useLocation();
    const productFetched = location.state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mainImage, setMainImage] = useState(productFetched.images0);
    const [currentData, setcurrentData] = useState([]);

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleOpenModal = (data) => {
        setcurrentData(data)
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [scrollClass, setScrollClass] = useState('');
    const [textColor, setTextColor] = useState('text-gray-700');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isVisible = prevScrollPos > currentScrollPos;
            const scrollClass = currentScrollPos >= 200 ? 'bg-white' : '';
            const textColor = currentScrollPos >= 200 ? 'text-gray-700' : 'text-gray-700';

            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
            setScrollClass(scrollClass);
            setTextColor(textColor);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);
    return (
        <main className="dark:bg-slate-800">
            <head>
                <title>
                    {productFetched.product_name}
                </title>
            </head>
            <Header color={textColor} visible={visible} bgColor={scrollClass} logo="/logoColor.png" />
            <section className="text-gray-700 body-font overflow-hidden">
                <div className="md:container py-4 px-4 mx-auto">
                    <div className="mx-auto mt-3 md:mt-16 flex flex-wrap">
                        <div className="lg:w-1/2 flex md:flex-row flex-col-reverse ">
                            <div className="flex flex-row md:flex-col gap-5 flex-wrap justify-center md:mt-0 mt-5">
                                {/* Sub Images */}
                                {['images0', 'images1', 'images2', 'images3', 'images4', 'images5'].map((imageKey, index) => (
                                    productFetched[imageKey] === '' ? null : (
                                        <div className="w-32 md:w-full h-24 overflow-hidden bg-white" key={index}>
                                            <img
                                                alt=""
                                                className="w-full h-full object-contain cursor-pointer object-center rounded border border-gray-200"
                                                src={`/uploads/products/${productFetched[imageKey]}`}
                                                onClick={() => handleImageClick(productFetched[imageKey])}
                                            />
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Main Image of Product */}
                            <div className="w-full h-[350px] overflow-hidden md:ml-2 ml-0 bg-white">
                                <img
                                    alt="ecommerce"
                                    className="object-contain object-center rounded border border-gray-200 w-full h-full"
                                    src={`/uploads/products/${mainImage}`}
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full lg:pl-10  lg:mt-0">
                            <nav className="flex mt-10 md:mt-0" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link to="/">
                                            <a href="" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white mt-1">
                                                <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                                Home
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                            <Link to="/Products">
                                                <a href="" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Products</a>
                                            </Link>
                                        </div>
                                    </li>
                                    <li aria-current="page">
                                        <div className="flex items-center">
                                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">{productFetched.product_name}</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                            {/* <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2> */}
                            <h1 className="text-gray-900 dark:text-gray-200 text-3xl title-font font-medium mb-1 mt-5">{productFetched.product_name}</h1>
                            <div className="flex mb-4">
                                <span className="flex items-center">
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <span className="text-gray-600 ml-3">4 Reviews</span>
                                </span>
                                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                                    <a href="" className="text-gray-500">
                                        <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a href="" className="ml-2 text-gray-500">
                                        <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a href="" className="ml-2 text-gray-500">
                                        <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                            <p className="leading-relaxed">{productFetched.description}</p>
                            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">

                            </div>
                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-gray-900">₹ {productFetched.price}</span>
                                <button className={`flex ml-auto text-white ${productFetched.cta === "1" ? 'bg-sky-500 hover:bg-sky-600' : 'bg-red-500 hover:bg-red-600'} border-0 py-2 px-6 focus:outline-none  rounded`}
                                    onClick={() => productFetched.cta === "1" ? handleOpenModal(productFetched) : ''}
                                >{productFetched.cta === "1" ? 'Get Enquiry' : 'Add to Cart'}</button>
                                <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                    <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <EnquiryModal isOpen={isModalOpen} onClose={handleCloseModal} bodyProduct={currentData} />

                </div>
            </section>
        </main>
    );
};

export default ProductDetail;
