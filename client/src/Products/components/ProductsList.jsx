import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import EnquiryModal from '../../Modals/Enquiry';

const ProductsList = () => {
    const [data, setData] = useState();
    const [Loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setcurrentData] = useState([]);

    const handleOpenModal = (data) => {
      setcurrentData(data)
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    useEffect(() => {
        const callProducts = async () => {
            try {
                const req = await fetch('/getAllProducts', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                    .then(response => response.json())
                    .then(jsonData => {
                        setData(jsonData);
                        setLoading(false);
                    }).catch(error => console.error(error))

            } catch (error) {
                console.log(error);
            }
        }
        callProducts();
    }, [])

    const navigate = useNavigate();
    const handleClick = (item) => {
        navigate('/ProductDetail', { state: item });
    };

    return (
        <section className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 text-center mt-20">
            <div>
                <p className="mt-4 sm:text-4xl  md:text-2xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-gray-600 dark:text-slate-300">Our Products</p>
            </div>
            <div>
                <p className="mt-1 sm:text-md text-sm leading-7 text-gray-400 dark:text-slate-400">Unleashing the Power of Electrification</p>
            </div>
            <div className="container mx-auto sm:mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
                {Loading ? (
                    'loading'
                ) : (
                    data.map((item, i) => (
                        <div key={i} className="mb-5">

                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div onClick={() => handleClick(item)} className="relative bg-white h-64 overflow-hidden cursor-pointer">
                                    <img
                                        className="rounded-t-lg w-full h-full object-contain"
                                        src={`/uploads/products/${item.images0}`}
                                        alt="product image"
                                    />
                                </div>
                                <div className="px-5 pb-5 mt-5">
                                    <h5 onClick={() => handleClick(item)} className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white cursor-pointer">
                                        {item.product_name}
                                    </h5>
                                    <div className="flex items-center mt-2.5 mb-5">
                                        {/* Star icons */}
                                        <div className="flex items-center mt-2.5 mb-5">
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                                        </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ₹ {item.price}
                                        </span>
                                        <button
                                            onClick={() => item.cta==="1" ? handleOpenModal(item) : ''}
                                            className={`text-white ${item.cta === "1" ? 'bg-sky-500 hover:bg-sky-600' : 'bg-red-500 hover:bg-red-600'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-blue-800`}
                                        >
                                            {item.cta==="1" ? 'Get Enquiry' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Calling on CTA button click */}
                            <EnquiryModal isOpen={isModalOpen} onClose={handleCloseModal} bodyProduct= {currentData} />
                        </div>
                    ))
                )}
            </div>

        </section >
    )
}

export default ProductsList