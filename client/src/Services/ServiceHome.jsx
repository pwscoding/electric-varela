import React, { useState, useEffect } from 'react';
import Header from './components/Header';

const ServiceHome = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollClass, setScrollClass] = useState('');
  const [textColor, setTextColor] = useState('');
  const [bgImage, setBgImage] = useState("/SBanner.png");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos;
      const scrollClass = currentScrollPos >= 200 ? 'bg-white' : '';
      const textColor = currentScrollPos >= 200 ? 'text-gray-700' : 'text-gray-200';

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
      setScrollClass(scrollClass);
      setTextColor(textColor);
    };

    const screenWidth = window.innerWidth;
    const newBgImage = screenWidth <= 768 ? "/SBannerMobile.png" : "/SBanner.png";
    setBgImage(newBgImage);

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const newBgImage = screenWidth <= 768 ? "/SBannerMobile.png" : "/SBanner.png";
      setBgImage(newBgImage);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [prevScrollPos, window.innerWidth]);

  return (
    <main>
      <head>
        <title>
          Services
        </title>
      </head>
      <div
        className={`w-full h-screen bg-cover bg-center flex flex-col`}
      >
        <header
          className={`transition-top h-screen lg:h-screen md:h-[40vh] md:bg-contain  bg-contain lg:bg-cover bg-no-repeat lg:bg-center w-full duration-300 ease-in-out z-[9999] ${scrollClass} ${visible ? 'top-0' : '-top-[50px]'
            }`}
          style={{
            backgroundImage: `url('${bgImage}')`

          }}
        // style={{
        //  background: `#343434`
        // }}
        >
          <Header color={textColor} visible={visible} bgColor={scrollClass} logo="/logoColor.png" />
        </header>


        {/* Your content here */}
      </div>
    </main>
  );
};

export default ServiceHome;
