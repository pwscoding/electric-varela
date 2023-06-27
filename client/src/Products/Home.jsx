import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductsList from './components/ProductsList';
import Footer from './components/Footer'
const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const slides = [
    {
      image:
        'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      headline: 'Efficient and Quick Boiling with our Electric Kettle',
      description:
        'Experience the convenience of our electric kettle that boils water in minutes. Perfect for making hot beverages, soups, and more',
      buttonLabel: 'Explore Product',
      buttonUrl: 'button-url-1',
    },
    {
      image:
        'https://images.unsplash.com/photo-1413882353314-73389f63b6fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      headline: 'Achieve a Brighter Smile with our Electric Toothbrush',
      description:
        'Our electric toothbrush provides superior cleaning power, removing plaque and stains for a whiter and healthier smile. Say goodbye to manual brushing!',
      buttonLabel: 'Button 2',
      buttonUrl: 'button-url-2',
    },
    {
      image:
        'https://images.unsplash.com/photo-1473308822086-710304d7d30c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80',
      headline: 'Smooth and Comfortable Shaving Experience with our Electric Shaver',
      description:
        'Get a close and precise shave without irritation using our electric shaver. Designed for smooth performance and gentle on the skin.',
      buttonLabel: 'Button 3',
      buttonUrl: 'button-url-3',
    },
  ];

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
    <main className='dark:bg-slate-800'>
      <head>
        <title>
            Products
        </title>
      </head>
      <div>
        <Header color={textColor} visible={visible} bgColor={scrollClass} logo= "/logoColor.png" />

        {/* Hero Slider for Products */}
        <div className='overflow-hidden'>
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div
                key={index}
                className='w-full h-[40vh] md:h-[100vh] flex flex-col items-center justify-center relative'
              >
                <div className='w-full h-[40vh] md:h-[100vh] absolute bg-gray-800/[0.7]'></div>
                <img src={slide.image} alt='Slide' className='w-full h-full object-cover' />
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <div className='text-center md:mt-0 mt-5'>
                    <h3 className='text-lg md:text-5xl font-bold mt-4 text-gray-100'>{slide.headline}</h3>
                    <p className='text-[10px] md:text-lg mt-2 text-gray-300'>{slide.description}</p>
                    <a href="javascript:void(0)" className="relative top-3 sm:top-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 sm:text-xl text-[12px] sm:top-6">Explore Product</a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <ProductsList />

       <Footer />
      </div>
    </main>
  );
};

export default Home;
