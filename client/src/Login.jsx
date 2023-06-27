import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Loading, setLoading] = useState(true);
    const [userData, setuserData] = useState([]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Perform login logic using the stored email and password values
        const res = await fetch("/user_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })

        const data = await res.json();
        if (data.message === "Logged Successfully") {
            let timerInterval
            Swal.fire({
                title: '<p className="text-green-500">Logged Successfully</p>',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        navigate("/")
                    }, 2500)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            })
            // Reset the form fields
            setEmail('');
            setPassword('');
        } else {
            Swal.fire(
                {
                    title: "<div className='text-red-500 text-xl md:text-2xl'>Invalid Credentials</div>",
                    icon: "error"
                }
            )
        }
    };

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
                setLoading(false)
                if (data === 'Unauthorized: No token Found' || data === 'User Data cannot find') {
                    navigate("/Login")
                } else {
                    navigate("/")
                }
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }

        CallUserData()
    }, [userData])

    console.log(Loading);
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="javascript:void(0)" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-full h-28 mr-2" src="./logoColor.png" alt="logo" />
                </a>
                {
                    Loading ?
                        <>
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                {/* Loading skeleton */}
                                <div className="animate-pulse p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </> :
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign in to your account
                                </h1>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            {/* Remember me checkbox */}
                                        </div>
                                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        Sign in
                                    </button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Don’t have an account yet? <Link to={'/Signup'}>
                                            <a href= "" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>

                }

            </div>
        </section>
    );
};

export default Login;
