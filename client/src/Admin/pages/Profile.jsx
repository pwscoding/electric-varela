import { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import Swal from 'sweetalert2'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { admindata } = useStateContext();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [middleName, setMiddleName] = useState();
  const [position, setPosition] = useState();
  const [joined_this_position_on, setJoinedThisPositionOn] = useState();
  const [status, setStatus] = useState();

  if (admindata?.status === 401) {
    window.location.href = '/Admin/Login';
  }

  useEffect(() => {
      try {
        // Only update the state if the component is still mounted
          setFirstName(admindata?.data?.firstname);
          setLastName(admindata?.data?.lastname);
          setMiddleName(admindata?.data?.middlename);
          setPosition(admindata?.data?.position);
          setJoinedThisPositionOn(admindata?.data?.joined_this_position_on);
          setStatus(admindata?.data?.status === 1 ? 'Active' : 'Not Active');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  
  }, [admindata]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setIsEditing(false);
        console.log({id:admindata?.data._id, firstName, lastName, middleName, position, joined_this_position_on, status});
        const res = await fetch("/admin_update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id:admindata?.data._id, firstName, lastName, middleName, position, joined_this_position_on, status
            })
        })

        const data = await res.json();
        if(data.status === 200) {
            let timerInterval
            Swal.fire({
                title: '<p className="text-green-500">Profile Updated Succesfully</p>',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                    }, 1000)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            })
        }
    };

    return (
        <div className='w-full md:w-7/12 mx-auto mt-10 m-2'>
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900  dark:text-gray-300">Admin Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">Personal details.</p>
            </div>
            <div className="mt-6 border-t">
                <dl className="divide-y divide-gray-100 dark:divide-gray-50">
                    {/* ... */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">First Name</dt>
                        {isEditing ? (
                            <dd className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    rows="4"
                                    className="resize-none block w-full shadow-sm h-10 p-2 sm:text-sm rounded-md"
                                />
                            </dd>
                        ) : (
                            <dd className="mt-1 text-sm leading-6 dark:text-white text-gray-700 sm:col-span-2 sm:mt-0">
                                {firstName}
                            </dd>
                        )}
                    </div>
                    {/* ... */}
                    {/* ... */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Last Name</dt>
                        {isEditing ? (
                            <dd className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    rows="4"
                                    className="resize-none block w-full shadow-sm h-10 p-2  sm:text-sm rounded-md"
                                />
                            </dd>
                        ) : (
                            <dd className="mt-1 text-sm leading-6 dark:text-white text-gray-700 sm:col-span-2 sm:mt-0">
                                {lastName}
                            </dd>
                        )}
                    </div>
                    {/* ... */}
                    {/* ... */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Middle Name</dt>
                        {isEditing ? (
                            <dd className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    rows="4"
                                    className="resize-none block w-full shadow-sm h-10 p-2 sm:text-sm rounded-md"
                                />
                            </dd>
                        ) : (
                            <dd className="mt-1 text-sm leading-6 dark:text-white text-gray-700 sm:col-span-2 sm:mt-0">
                                {middleName}
                            </dd>
                        )}
                    </div>
                    {/* ... */}
                    {/* ... */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Position</dt>
                        {isEditing ? (
                            <dd className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    rows="4"
                                    className="resize-none block w-full shadow-sm h-10 p-2 sm:text-sm rounded-md"
                                />
                            </dd>
                        ) : (
                            <dd className="mt-1 text-sm leading-6 dark:text-white text-gray-700 sm:col-span-2 sm:mt-0">
                                {position}
                            </dd>
                        )}
                    </div>
                    {/* ... */}
                    {/* ... */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Joined Date</dt>
                        {isEditing ? (
                            <dd className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={joined_this_position_on}
                                    onChange={(e) => setJoinedThisPositionOn(e.target.value)}
                                    rows="4"
                                    className="resize-none block w-full shadow-sm h-10 p-2 sm:text-sm rounded-md"
                                />
                            </dd>
                        ) : (
                            <dd className="mt-1 text-sm leading-6 dark:text-white text-gray-700 sm:col-span-2 sm:mt-0">
                                {joined_this_position_on}
                            </dd>
                        )}
                    </div>
                    {/* ... */}
                    {/* ... */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Status</dt>
                        {isEditing ? (
                            <dd className="mt-1 sm:col-span-2 sm:mt-0 flex">
                                <div className='flex ml-10'>
                                    <input
                                        type='radio'
                                        name='status'
                                        value={status}
                                        onChange={(e) => setStatus('Active')}
                                        className="resize-none block w-full shadow-sm  sm:text-sm border-gray-300 rounded-md"
                                    />
                                    <p className='ml-2'>Active</p>
                                </div>
                                <div className='flex ml-10'>
                                    <input
                                        type='radio'
                                        name='status'
                                        value={status}
                                        onChange={(e) => setStatus('Deactive')}
                                        className="resize-none block w-full shadow-sm  sm:text-sm border-gray-300 rounded-md"
                                    />
                                    <p className='ml-2'>Deactive</p>
                                </div>
                            </dd>
                        ) : (
                            <dd className="mt-1 text-sm leading-6 dark:text-white text-gray-700 sm:col-span-2 sm:mt-0">
                                {status}
                            </dd>
                        )}
                    </div>
                    {/* ... */}

                </dl>
            </div>
            <div className="flex justify-end mt-4 pr-4">
                {isEditing ? (
                    <button
                        onClick={handleSaveClick}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={handleEditClick}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
