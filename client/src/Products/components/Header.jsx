import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../Admin/contexts/ContextProvider';
import { Link } from 'react-router-dom';
import { menuItems } from '../../Admin/data/dummy';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { AiOutlineLogin } from 'react-icons/ai';
export default function Header({ color, bgColor, visible, logo }) {
  const [userData, setuserData] = useState([]);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    currentColor,
    themeSettings,
    setThemeSettings
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleServicesDropdownToggle = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  const currentPath = window.location.pathname;
  
  const getActiveMenu = () => {
    const activeMenuIndex = menuItems.findIndex((item) => item.link === currentPath);
    console.log(activeMenuIndex);
    return activeMenuIndex !== -1 ? activeMenuIndex : -1;
  };
  const activeMenu = getActiveMenu();
  useEffect(() => {
    const CallUserData = async () => {
      try {
        const response = await fetch("/user_profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        }
        )
        const data = await response.json();
        setuserData(data)
        if (data==='Unauthorized: No token Found' || data==='User Data cannot find') {
          // navigate("/Login")
        }
      } catch (error) {
        console.log(error);
        // navigate("/Login")
        setLoading(false)
      }
    }

    if (userData.length===0) CallUserData()

    
  }, [userData])

  useEffect(() => {
    const callcategories = async () => {
      try {
        const req = await fetch('/getAllServicecategories', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(response => response.json())
          .then(jsonData => {
            setCategory(jsonData);
          }).catch(error => console.error(error))

      } catch (error) {
        console.log(error);
      }
    }
    callcategories();
  }, [])

  const handleClick = (item) => {
    navigate(`/ServicesCategory?${item.service_category_name}`, { state: item });
};
  return (
    <>
      <header className={`transition-top  w-full ${bgColor} ${visible ? 'top-0' : '-top-52' } duration-300 ease-in-out z-[999999999999]`}>
        <nav className="px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href= "" className="flex items-center">
              <img src={`..${logo}`} className="mr-3 h-[60px] md:h-[100px] relative md:top-2" alt="LOGO" />
            </a>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              onClick={handleMobileMenuToggle}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`w-6 h-6 ${mobileMenuOpen ? 'hidden' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <svg className={`w-6 h-6 ${mobileMenuOpen ? '' : 'hidden'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className={`justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ${mobileMenuOpen ? '' : 'hidden'}`} id="mobile-menu-2">
              <ul className="flex flex-col mt-4 text-white lg:flex-row lg:space-x-8 lg:mt-0">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.dropdown ? (
                      <div className="relative">
                        <button
                          onClick={handleServicesDropdownToggle}
                          className={`block py-2 pr-4 pl-3 font-bold 
                          lg:p-0 ${color}
                          flex ${servicesDropdownOpen ? 'text-red-500 dark:text-red-500' : ''}`}
                          aria-expanded={servicesDropdownOpen}
                        >
                          {item.label}
                          <svg className="w-4 h-4 ml-2 relative top-[4px] -left-[2px]" viewBox="0 0 20 20" fill="currentColor">
                            {servicesDropdownOpen ? (
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6 8l4 4 4-4h-8zm0 4l4 4 4-4h-8z"
                              />
                            ) : (
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 6l4 4-4 4-4-4 4-4z"
                              />
                            )}
                          </svg>
                        </button>
                        {servicesDropdownOpen && (
                          <ul className="absolute mt-2 space-y-2 bg-white  rounded-md shadow-lg right-0 z-[99]">
                            {category.map((subItem, subIndex) => (
                              <li key={subIndex} className='cursor-pointer' onClick={() => handleClick(subItem)}>
                                  <a
                                    className={`block px-4 py-2 text-gray-800 hover:bg-gray-300 rounded-md`}>
                                    {subItem.service_category_name}
                                  </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link to={item.link}>
                        <a
                          className={`block py-2 pr-4 pl-3 font-bold lg:p-0 ${activeMenu === index ? 'text-red-500' : color}`}>
                          {item.label}
                          
                        </a>
                      </Link>
                    )}
                  </li>
                ))}

                {
                  userData.length===0 ?
                    <button
                      className="flex items-center space-x-1 md:ml-0 ml-2 focus:outline-none"
                      onClick={() => navigate("/Login")}
                    >
                      <AiOutlineLogin className={`w-6 h-6 ${color}`} />
                    </button> : <div className={`relative inline-block  ${color}`}>
                      <button
                        className="flex items-center space-x-1 md:ml-0 ml-2 focus:outline-none"
                        onClick={toggleDropdown}
                      >
                        <HiOutlineUserCircle className="w-6 h-6" />
                        <p className='w-20 truncate  text-ellipsis overflow-hidden '>{userData.fullName}</p>
                        <IoMdArrowDropdown className="w-4 h-4" />
                      </button>
                      {isOpen && (
                        <div className="absolute right-0 mt-2 py-2 bg-white rounded shadow-lg z-[99]">
                          <a
                            href="#"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          >
                            Profile
                          </a>
                          <a
                            href="/Logout"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          >
                            Logout
                          </a>
                        </div>
                      )}
                    </div>
                }
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
