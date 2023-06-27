import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

const EnquiryModal = ({ isOpen, onClose, bodyProduct }) => {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ProductId, setProductId] = useState(bodyProduct._id);
    const [productName, setProductName] = useState(bodyProduct.product_name);
    const [productQuantity, setProductQuantity] = useState('1');
    const [description, setDescription] = useState('');
    const [LoadingBtn, setLoadingBtn] = useState(false);
    const [userData, setuserData] = useState([]);

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

                setName(data.fullName)
                setEmail(data.email)
            } catch (error) {
                console.log(error);
            }
        }

        if (userData.length===0) CallUserData()
    }, [userData])

    const handleCheckboxChange = (e) => {
        setShowPasswordFields(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingBtn(true)
        // Performing form submission or validation here
        // Clear form fields if needed
        const pid = bodyProduct._id
        if (showPasswordFields) {
            if (password===confirmPassword) {
                const UserRegisterandStore = await fetch('/user_register', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        showPasswordFields, name, email, password, confirmPassword, productName, productQuantity, description
                    })
                })

                const UserRegisterandStoreData = await UserRegisterandStore.json();
                if (UserRegisterandStoreData.message==='Registered Successfully') {
                    let timerInterval
                    Swal.fire({
                        title: '<p className="text-green-500">Registered Successfully</p>',
                        icon: 'success',
                        timer: 3000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(async () => {
                                const productEnquirySchema = await fetch('/productEnquirySchema', {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        name, email, pid, productQuantity, description, status: 'user', userId: UserRegisterandStoreData.userId
                                    })
                                })

                                const result = await productEnquirySchema.json();
                                if (result.status===200) {
                                    Swal.fire({
                                        title: '<p className="text-green-500">Enquiry Sended Successfully</p>',
                                        icon: 'success',
                                        timer: 3000,
                                        timerProgressBar: true,
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            Swal.showLoading()
                                            timerInterval = setInterval(async () => {
                                                window.location.href = "/EnquiryStatus"
                                            })
                                        },
                                        willClose: () => {
                                            clearInterval(timerInterval)
                                        }
                                    })
                                } else {
                                    Swal.fire({
                                        title: '<p className="text-red-500">' + result.message + '</p>',
                                        icon: 'error',
                                        timer: 3000,
                                        timerProgressBar: true,
                                        allowOutsideClick: false,

                                    })
                                }
                            }, 2500)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    })

                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setDescription('');
                } else if (UserRegisterandStoreData.message==='User Already Exists') {
                    Swal.fire(
                        {
                            title: "<div className='text-red-500 text-xl md:text-2xl'>User Already Exists</div>",
                            icon: "error"
                        }
                    )
                }

            } else {
                Swal.fire({
                    title: '<p className="text-red-500">Invalid Password</p>',
                    icon: 'error',
                    timer: 3000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                })
            }
            setLoadingBtn(false)
        } else {
            let status = 'guest'
            let userId = ''
            if (userData.length===0) {
            } else {
                status = 'user'
                userId = userData._id
            }
            const productEnquirySchema = await fetch('/productEnquirySchema', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, pid, productQuantity, description, status, userId
                })
            })

            const result = await productEnquirySchema.json();
            if (result.status===200) {
                Swal.fire({
                    title: '<p className="text-green-500">Enquiry Sended Successfully</p>',
                    icon: 'success',
                    timer: 3000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(async () => {
                            window.location.href = "/EnquiryStatus"
                        })
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setDescription('');
            } else {
                Swal.fire({
                    title: '<p className="text-red-500">' + result.message + '</p>',
                    icon: 'error',
                    timer: 3000,
                    timerProgressBar: true,
                    allowOutsideClick: false,

                })
            }
            setLoadingBtn(false)
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex  justify-center z-50 ${isOpen ? 'overlay' : ''}`}>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="md:h-3/4 h-full bg-white dark:bg-slate-800 w-96 lg:w-2/5 p-4 rounded shadow-lg overflow-auto">
                    <h1 className='text-xl md:text-2xl text-gray-800 dark:text-gray-300 text-left mt-2 mb-4 font-semibold'>Electric Products Inquiry Form</h1>
                    <hr className='md:mb-6' />
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                            <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Product Id</label>
                            <input
                                type="text"
                                placeholder='Enter Product Id'
                                value={bodyProduct._id}
                                onChange={(e) => setProductId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                                disabled
                            />
                        </div>
                        <div className="mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                            <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Product Name</label>
                            <input
                                type="text"
                                placeholder='Enter Product Name'
                                value={bodyProduct.product_name}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded "
                                required
                                disabled
                            />
                        </div>
                        <div className="mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                            <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Product Quantity</label>
                            <input
                                type="number"
                                placeholder='Enter the Quantity of Product'
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                                min={1}
                            />
                        </div>
                        <div className="mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                            <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Description</label>
                            <textarea
                                value={description}
                                placeholder='I would appreciate it if you could give me more details about the specific information you need related to this Product.'
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                                rows={9}
                            />
                        </div>

                        <hr />

                        <div className="mt-4 mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                            <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Name</label>
                            <input
                                type="text"
                                placeholder='Ex. Shadab Khan'
                                value={userData?.fullName}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                            <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Email</label>
                            <input
                                type="email"
                                placeholder='example@gmail.com'
                                value={userData?.email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        {showPasswordFields ? (
                            <div className="mb-4 flex  md:flex-row flex-col md:gap-5 gap-2 ">
                                <label className="block w-full md:w-2/5 md:ml-2  ml-0 font-bold text-gray-800 dark:text-gray-400 text-left">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                        ) : ''}
                        {showPasswordFields ? (
                            <div className="mb-4 flex md:flex-row flex-col  md:gap-5 gap-2">
                                <label className="block w-full md:w-2/5 md:ml-2  ml-0  font-bold text-gray-800 dark:text-gray-400 text-left">Confirm Password </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />

                            </div>
                        ) : ''}
                        <div className="mb-4 mt-10">
                            {
                                userData.length===0 ?
                                    <label className="flex gap-2 items-center text-gray-800 dark:text-gray-400 ">
                                        <input
                                            type="checkbox"
                                            checked={showPasswordFields}
                                            onChange={handleCheckboxChange}
                                            cl2s5 ml-2Name="text-left"
                                        />
                                        Create Account
                                    </label>
                                    : ''
                            }
                        </div>
                        <div className='flex gap-5 justify-center '>
                            {
                                LoadingBtn ?
                                    <div role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    : <>
                                        <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Send Enquiry</button>
                                    </>
                            }
                            <button onClick={onClose} className='text-gray-800 dark:text-gray-400  relative -top-1'>Close</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default EnquiryModal;
