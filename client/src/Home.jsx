import { FiPackage, FiTool } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="relative">
        <head>
          <title>
            Varela - American Electric
          </title>
        </head>
        <div className="relative flex md:flex-row flex-col justify-center items-center h-screen">
          <Link
            to="/Products"
            className="w-full md:w-1/2 h-screen p-2 flex flex-col items-center justify-center border-b md:border-b-0 border-r-0 md:border-r-2 border-gray-300 hover:bg-blue-100 hover:border-blue-500 transition-colors duration-300"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white hover:bg-blue-500 hover:text-white transition-colors duration-300">
              <FiPackage className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-bold mt-4 mb-2">Products</h3>
          </Link>
          <Link
            to="/Services"
            className="w-full md:w-1/2 h-screen p-2 flex flex-col items-center justify-center border-l-0 md:border-l-2 border-gray-300 hover:bg-blue-100 hover:border-blue-500 transition-colors duration-300"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white hover:bg-blue-500 hover:text-white transition-colors duration-300">
              <FiTool className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-bold mt-4 mb-2">Services</h3>
          </Link>
        </div>
      </div>
    </>
  );
}
