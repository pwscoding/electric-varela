import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useNavigate } from 'react-router-dom';

import avatar from '../data/profile.png';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = ({ token }) => {
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState([]);
  const [pageLoad, setpageLoad] = useState(false);
  const [Prevent, setPrevent] = useState(false);

  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
    admindata
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  useEffect(() => {

    if (admindata.status === 401) {
      window.location.href = '/Admin/Login'
    } else {
      console.log(admindata, 'hey');
    }
  }, [admindata])



  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      {
        admindata?.status === 200 ?
          <>
            <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
            <div className="flex">
              <TooltipComponent content="Profile" position="BottomCenter">
                <div
                  className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                  onClick={() => handleClick('userProfile')}
                >
                  <img
                    className="rounded-full w-8 h-8"
                    src={avatar}
                    alt="user-profile"
                  />
                  <p>
                    <span className="text-gray-400 text-14">Hi,</span>{' '}
                    <span className="text-gray-400 font-bold ml-1 text-14">
                      {`${admindata?.data.firstname} ${admindata?.data.lastname}`}
                    </span>
                  </p>
                  <MdKeyboardArrowDown className="text-gray-400 text-14" />
                </div>
              </TooltipComponent>

              {isClicked.userProfile && (<UserProfile data={admindata?.data} />)}
            </div>
          </> : 'Loading'
      }
    </div>
  );
};

export default Navbar;
