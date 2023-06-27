import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { BsArrowRight } from 'react-icons/bs';

const ServiceDetail = () => {
    const location = useLocation();
    const serviceDetailsData = location.state;
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [scrollClass, setScrollClass] = useState('');
    const [textColor, setTextColor] = useState('text-gray-800');
    const [relatedService, setrelatedService] = useState([])
    const [relatedLoading, setrelatedLoading] = useState(true)
    const navigate = useNavigate();

    const convertToNormalFormat = (content) => {
        // Remove any HTML tags and convert special characters
        const normalText = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
        return normalText;
    };

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

    const handleRollback = (item) => {
        navigate(`/ServicesCategory?${item.service_category_name}`, { state: item });
    };

    useEffect(() => {
        setrelatedLoading(true)
        const callServices = async () => {
            try {
                const response = await fetch('/getAllServices', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const jsonData = await response.json();
                setrelatedService(jsonData.filter((item) => item._id != serviceDetailsData._id && item.service_category_name===serviceDetailsData.service_category_name));
                setrelatedLoading(false)
            } catch (error) {
                console.error(error);
            }
        };
        callServices();
    }, [serviceDetailsData]);

    const handleClick = (item) => {
        navigate(`/ServiceDetail?${item.service_title}`, { state: item });
    };
    return (
        <main>
            <head>
                <title>
                    {serviceDetailsData.service_title}
                </title>
            </head>
            <Header color={textColor} visible={visible} bgColor={scrollClass} logo="/logoColor.png" />
            <div className='relative top-32 '>

                {/* Breadcrumb  */}
                <div className='relative w-screen h-48'>
                    <img src={`/ServiceBreadCrumbImage.jpg`} className='w-full h-full object-cover' />
                    <div className="absolute bg-gray-700/50 top-0 w-screen h-full"></div>
                    <div className='absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-1/2 text-center'>
                        <h1 className='text-white capitalize md:text-2xl text-lg font-bold'>{serviceDetailsData.service_title}</h1>
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <a href="/" className="inline-flex items-center md:text-[14px] text-[10px] font-bold text-white hover:text-blue-600 dark:hover:text-white">
                                        <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-center" onClick={() => handleRollback(serviceDetailsData)}>
                                        <svg aria-hidden="true" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                        <a href={`javascript:void(0)`} className="ml-1 md:text-[14px] text-[10px] font-bold text-white hover:text-blue-600 md:ml-2 dark:hover:text-white">Service</a>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center" onClick={() => handleRollback(serviceDetailsData)}>
                                        <svg aria-hidden="true" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                        <a href={`javascript:void(0)`} className="ml-1 md:text-[14px] text-[10px] font-bold text-white hover:text-blue-600 md:ml-2 dark:hover:text-white">{serviceDetailsData.service_category_name}</a>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg aria-hidden="true" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                        <span className="ml-1 md:text-[14px] text-[10px] font-medium text-white md:ml-2">{serviceDetailsData.service_title}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* // Main Content // */}

                <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                    <div className="md:grid gap-8 px-4 mx-auto max-w-screen-xl lg:grid-cols-12">
                        {
                            relatedLoading ? <article className="col-span-8 order-first ">
                                <div className='w-full h-96 overflow-hidden'>
                                    {/* Placeholder for image */}
                                    <div className="h-full bg-gray-300"></div>
                                </div>

                                <header className="mb-4 mt-5 lg:mb-6 ">
                                    <h1 className=" mb-4 ">
                                        {/* Placeholder for service title */}
                                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                    </h1>
                                </header>

                                <div className='mt-10 space-y-6 text-justify'>
                                    {/* Placeholder for service description */}
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </article>
                                :
                                <article className="col-span-8 mx-auto max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                                    <div className='w-full h-96 overflow-hidden'>
                                        <img src={`${serviceDetailsData.imageBody==='' || serviceDetailsData?.imageBody===undefined ? '/noImage.png' : `/uploads/services/${serviceDetailsData.imageBody}`}`} className='object-contain w-full h-full rounded-md' alt={serviceDetailsData.service_title} />
                                    </div>
                                    <header className="mb-4 mt-5 lg:mb-6 not-format">
                                        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white capitalize">{serviceDetailsData.service_title}</h1>
                                    </header>
                                    <div className='mt-5 text-justify'>
                                        <div dangerouslySetInnerHTML={{ __html: serviceDetailsData.description }} ></div>
                                    </div>
                                </article>
                        }
                        <div className="col-span-4 flex flex-col gap-3 md:flex-col md:gap-4 md:mt-0 mt-10">
                            {/* Render the list of services here */}
                            {
                                relatedLoading ?
                                    <ul className="space-y-6 p-4 rounded shadow-lg">
                                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                        <li className="mb-2 p-4 animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                        </li>
                                        <li className="p-4 animate-pulse">
                                            <div className="h-4  bg-gray-300 rounded w-1/2"></div>
                                        </li>
                                        <li className="p-4 animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        </li>
                                        <li className="p-4 animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                        </li>
                                        <li className="p-4 animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                        </li>

                                    </ul> :
                                    <>
                                        <div className='flex justify-between'>
                                            <h1 className='font-bold'>Related Services:</h1>
                                            <Link to={``}>
                                                <a href= "" className='text-sky-700'>See more</a>
                                            </Link>
                                        </div>
                                        <ul className='space-y-6'>
                                            {
                                                relatedService.slice(0, 5).map((rservice, i) => {
                                                    return <>
                                                            <li
                                                                key={i}
                                                                onClick={() => handleClick(rservice)}
                                                                className="list-none border p-4 border-slate-500 cursor-pointer hover:bg-gray-200/30 flex justify-between"
                                                            >
                                                                {rservice.service_title}
                                                                <BsArrowRight className="ml-2" />
                                                            </li>
                                                    </>
                                                })
                                            }
                                        </ul>
                                        <div className=' h-[400px] bg-center bg-cover relative oveflow-hidden' style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/electrical-engineer-technician-ceo-executive-business-people-making-handshake-after-meeting-clean-green-alternative-energy-concept_38052-3049.jpg')` }}>
                                            <div className='absolute top-0 bg-black/70 w-full h-[400px]'></div>
                                            <div className="flex  flex-col justify-center items-center relative p-4 z-[999999] inset-0">
                                                <img src="/telephone.png" className='w-[80px] ' alt="" />
                                                <div className="text-white flex flex-col items-center">
                                                    <h1 className="text-2xl font-bold text-center mt-1">{serviceDetailsData.contactTitle}</h1>
                                                    <p className="text-lg text-center">{serviceDetailsData.contactDescription}</p>
                                                    <a href={`tel:${serviceDetailsData.contactNumber}`} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                                        Call Now
                                                    </a>
                                                </div>
                                                <div className="flex mt-16 space-x-4">
                                                    <a href={`https://facebook.com`} target='_blank' className="text-white hover:text-gray-300">
                                                        <img src="/facebook.png" className='w-[50px] ' alt="" />
                                                    </a>
                                                    <a href={`https://instagram.com`} target='_blank' className="text-white hover:text-gray-300">
                                                        <img src="/instagram.png" className='w-[50px] ' alt="" />
                                                    </a>
                                                    <a href={`https://api.whatsapp.com/send?phone=9167263576&text=''&source=&data=&app_absent=`} className="text-white hover:text-gray-300" target='_blank'>
                                                        <img src="/whatsapp.png" className='w-[50px] ' alt="" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                            }
                            {/* ... */}
                        </div>

                    </div>
                </main>


            </div>
        </main>
    );
};

export default ServiceDetail;
