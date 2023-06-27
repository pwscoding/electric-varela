import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const EnquiryStatus = () => {
  const [enquiryId, setEnquiryId] = useState('');
  const [enquiryData, setEnquiryData] = useState(null);
  const [filteredData, setfilteredData] = useState([]);

  useEffect(async () => {
    if (enquiryData===null) {
      const response = await fetch("/getAllEnquiries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      }
      )
      const data = await response.json();
      setEnquiryData(data);
    }
  }, [enquiryData])

  const handleSearch = async () => {
    try {
      if(filteredData.length===0) {
        setfilteredData({message: 'No Enquiry Found....'})
      }else{
        setfilteredData(enquiryData.filter((item, i) => item._id===enquiryId));
      }
    } catch (error) {
      console.error('Error fetching enquiry:', error);
      setEnquiryData(null);
      setfilteredData(null);

    }
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
    <main className='dark:bg-slate-800'>
      <head>
          <title>
            Enquiry Status
          </title>
      </head>
      <div>
        <Header color={textColor} visible={visible} bgColor={scrollClass} logo="/logoColor.png"/>

        <div className='container mx-auto'>
          <h1 className='text-3xl font-semibold text-center mt-8'>Enquiry Status</h1>
          <div className='mt-10 flex justify-center'>
            <input
              type='text'
              placeholder='Enter Enquiry ID'
              value={enquiryId}
              onChange={(e) => setEnquiryId(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-md'
            />
            <button
              onClick={handleSearch}
              className='ml-4 px-4 py-2 bg-blue-500 text-white rounded-md'
            >
              Search
            </button>
          </div>

          {filteredData.length > 0 ? (
            <div className='mt-8 p-4 bg-white rounded-md shadow-md'>
              <figure className="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                  <p>{filteredData[0]?.message }</p>
                </blockquote>
                <figcaption className="flex items-center space-x-4">
                  <img src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png" alt="" className="flex-none w-14 h-14 rounded-full object-cover" loading="lazy" decoding="async" />
                  <div className="flex-auto">
                    <div className="text-base text-slate-900 font-semibold dark:text-slate-300">
                      <span className="absolute inset-0">
                      </span>{filteredData[0]?.name}
                    </div>
                    <div className="mt-0.5">{filteredData[0]?.status}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          ) : 'No Data Found....'}
        </div>

        {/* <Footer /> */}
      </div>
    </main>
  );
};

export default EnquiryStatus;
