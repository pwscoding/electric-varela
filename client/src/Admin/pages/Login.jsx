import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const AdminLogin = ({ token }) => {
    const [loggingLoad, setloggingLoad] = useState(false)
    const [pageLoad, setpageLoad] = useState(false)
    const [inputsvalues, setinputsvalues] = useState({
        emailId: "",
        password: "",
    })

    const [userdata, setuserdata] = useState([])
    const [Prevent, setPrevent] = useState(false)

    const styles =
    {
        heading: "font-bold md:text-[64px] md:leading-[70px] text-[34px] leading-[46px] tracking-[-0.5%] text-center mt-3",
        label: "block text-gray-700 text-sm font-bold mb-2",
        input: "w-full shadow h-12  appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline dark_bg  border-2 border-[#b673f8]"
    }

    const AdminLoginInput = [
        // { id: "year_sem", label: "Sem/Year", name: "year_sem", type: "text" },
        { id: "emailId", label: "Admin Id", name: "emailId", type: "email", class: "bg-[#0F172A] w-80 mt-2 rounded-br-2xl rounded-tl-2xl appearance-none  relative block  px-3 py-2 border  placeholder-white text-white rounded-t-md mb-2  border-[#16F6E9] " },
        { id: "password", label: "Password", name: "password", type: "password", class: "bg-[#0F172A] w-80 mt-2 rounded-br-2xl rounded-tl-2xl appearance-none  relative block  px-3 py-2 border  placeholder-white text-white rounded-t-md mb-2  border-[#16F6E9] " },
    ]

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setinputsvalues({ ...inputsvalues, [name]: value })
    }

    const AdminLoginUser = async (e) => {
        e.preventDefault()
        const { emailId, password } = inputsvalues
        console.log(inputsvalues);
        if (inputsvalues.emailId === "" || inputsvalues.password === "") {
            Swal.fire(
                {
                    title: "<div className='text-red-500 text-xl md:text-2xl'>All Fields are required</div>",
                    icon: "error"
                }
            )
        }

        else {
            setloggingLoad(true)
            const res = await fetch("/admin_login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailId, password
                })
            })

            const data = await res.json();
            setloggingLoad(false)
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
                            window.location.href = '/Admin'
                        }, 2500)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            } else {
                Swal.fire(
                    {
                        title: "<div className='text-red-500 text-xl md:text-2xl'>Invalid Credentials</div>",
                        icon: "error"
                    }
                )
            }
        }
    }

    // Checking user Adminlogin or not 
    const CallUserData = async () => {
        setpageLoad(true)
        try {
            const response = await fetch("/admin_profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }
            )
            const data = await response.json();
            console.log(data);
            if(data.status === 401){
                setpageLoad(false)
                setuserdata(data);
            }else{
                setPrevent(true)
                setuserdata(data);
                setpageLoad(false)
            }
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
      if(userdata.status != 401 || userdata.length != 0) CallUserData()
    }, [])

    {
        Prevent ? window.location.href= '/Admin' : ''
    }
    return (
        <>
            <div className="bg-slate-800 flex min-h-full h-screen flex-1 flex-col justify-center items-center">
                {
                    pageLoad ? <div
                    className="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span>
                  </div>
                  :
                        <>
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <img
                                    className="mx-auto h-10 w-auto"
                                    src="/logo.png"
                                    alt="Your Company"
                                />
                                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
                                    Sign in to your account
                                </h2>
                            </div>

                            <div className="mt-10 md:mx-auto sm:w-full sm:max-w-sm">
                                <form className="space-y-6" onSubmit={AdminLoginUser}>
                                    {
                                        AdminLoginInput.map((input, i) => {
                                            return <>
                                                <div>
                                                    <label htmlFor={input.id} className="block text-sm font-medium leading-6 text-gray-200">
                                                        {input.label}
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            value={inputsvalues.name}
                                                            onChange={handleChange}
                                                            autoComplete="current-password"
                                                            required
                                                            id={input.id} name={input.name} type={input.type}
                                                            className="p-2 focus:outline-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        })
                                    }


                                    <div>
                                        {
                                            loggingLoad ? <>
                                                <div className="flex justify-center items-center">
                                                    <div className="spinner"></div>
                                                </div>
                                            </> : <>
                                                <button
                                                    type="submit"
                                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Sign in
                                                </button>
                                            </>
                                        }
                                    </div>
                                </form>
                            </div>
                        </>
                }
            </div>
        </>
    )
}

export default AdminLogin



export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.jwtoken || '' } }
}