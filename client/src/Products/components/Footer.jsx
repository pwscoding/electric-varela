import React from 'react'
import { menuItems } from '../../Admin/data/dummy'
import { Link } from 'react-router-dom'
const Footer = () => {
    const date = new Date()
    return (
        <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800 mt-[150px]">
            <div className="mx-auto max-w-screen-xl text-center">
                <a href="/" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    <img src="../Logo.png" className="mr-3 h-[60px] sm:h-[60px]" alt="LOGO" />
                </a>
                <p className="my-6 text-gray-500 dark:text-gray-400">x is a leading electrician company specializing in providing top-quality electrical services to residential, commercial, and industrial clients. With a team of highly skilled and certified electricians, we are committed to delivering exceptional solutions that meet our customers' unique needs and exceed their expectations.
                    Our company has been serving the community for over 12, establishing a reputation for reliability, professionalism, and outstanding customer service. We pride ourselves on our attention to detail, precision workmanship, and adherence to the highest safety standards.</p>
                <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
                    {
                        menuItems.map((item, i) => {
                            return <>
                                <li>
                                    <Link to={item.link}>
                                        <a href= "" className="mr-4  md:mr-6 ">{item.label}</a>
                                    </Link>
                                </li>
                            </>
                        })
                    }

                </ul>
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {date.getFullYear()} <a href="#" className="hover:underline">XYZ</a>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}

export default Footer