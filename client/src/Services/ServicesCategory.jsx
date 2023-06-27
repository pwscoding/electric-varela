import React, { useState, useEffect } from 'react';
import { useLocation , useNavigate} from 'react-router-dom';
import Header from './components/Header';
const ServicesCategory = () => {
  const location = useLocation();
  const serviceCategoryName = location.state;
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollClass, setScrollClass] = useState('');
  const [textColor, setTextColor] = useState('text-gray-800');
  const [allServices, setAllServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const SkeletonLoader = () => {
    return (

      <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
        <div className="flex items-center justify-center w-full h-[300px] mb-4 bg-gray-300 rounded dark:bg-gray-700">
          <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>

        <span className="sr-only">Loading...</span>
      </div>

    );
  };

  const renderArticles = () => {
    const articles = [];

    for (let i = 0; i < 10; i++) {
      articles.push(
        <article key={i}>
          {SkeletonLoader()}
        </article>
      );
    }

    return articles;
  };

  useEffect(() => {
    setIsLoading(true);
    const callServices = async () => {
      try {
        const response = await fetch('/getAllServices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        const jsonData = await response.json();

        setAllServices(jsonData.filter(item => item?.service_category_name===serviceCategoryName.service_category_name));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };


    if (allServices.length===0 || serviceCategoryName) callServices();

  }, [serviceCategoryName]);

  const handleClick = (item) => {
    navigate(`/ServiceDetail?${item.service_title}`, { state: item });
  };

  return (
    <main>
        <head>
          <title>
            Service Categories
          </title>
      </head>
      <Header color={textColor} visible={visible} bgColor={scrollClass} logo="/logoColor.png" />
      <div className='relative top-20 md:container md:mx-auto'>
        <div className="bg-white py-12 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our {serviceCategoryName?.service_category_name} Services</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 md:gap-x-8 md:gap-y-16 gap-y-10 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {
                isLoading ? renderArticles() :
                  allServices.length > 0 ?
                    allServices.map((service) => (
                      <article key={service._id} onClick={() => handleClick(service)} className="cursor-pointer flex max-w-xl flex-col items-start justify-between">
                        <div className='w-full md:h-[300px] overflow-hidden'>
                          <img src={`${service.imageBody==='' || service?.imageBody===undefined ? '/noImage.png' : `/uploads/services/${service.imageBody}`}`} className='md:object-cover object-contain w-full h-full rounded-md' alt={service.service_title} />
                        </div>
                        <div className="flex items-center mt-3 gap-x-4 text-xs">
                          <a
                            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                          >
                            {serviceCategoryName.service_category_name}
                          </a>
                        </div>
                        <div className="group relative mt-2">
                          <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                            <a  href= "">
                              <span className="absolute inset-0" />
                              {service.service_title}
                            </a>
                          </h3>
                          <p className="md:mt-4 mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                            <div dangerouslySetInnerHTML={{ __html: service.description }}></div>
                          </p>
                        </div>
                      </article>
                    )) : <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 text-lg">No data found.</p>
                    </div>
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServicesCategory;
