import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, message, Pagination, Select, InputNumber, Upload, Image, DatePicker, TimePicker } from 'antd';
import { NavLink } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';

const Category = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [data, setData] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [imageUploadModal, setimageUploadModal] = useState(false);
  const [viewImageModal, setviewImageModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [DisplayImages, setDisplayImages] = useState([]);
  const [onkeyDisplayImages, setonkeyDisplayImages] = useState([]);

  const AdminUrl = "/Admin"

  const [images, setImages] = useState([]);
  const handleDrop = (acceptedFiles, zoneIndex) => {
    const updatedImages = [...images];
    updatedImages[zoneIndex] = acceptedFiles;
    setImages(updatedImages);
  };

  const renderDropZone = (zoneIndex) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        'image/png': ['.png', '.jpg', '.jpeg'],
      },
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, zoneIndex),
    });

    return (
      <div className='w-4/12 m-2'>
        <div {...getRootProps()} className=" p-2 cursor-pointer text-center justify-center border border-gray-200 bg-gray-300 h-48 flex justify-center items-center">
          <input {...getInputProps()} />
          <div>
            <p className="text-center text-5xl">+</p>
            <p className="text-gray-500">Only upload images in formats such as JPEG, PNG, or GIF.</p>
          </div>
        </div>
        {images[zoneIndex] && (
          <div className=" border">
            {images[zoneIndex].map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Image ${index + 1}`}
                className="w-32 h-32 object-contain"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleImageUploadModal = async () => {
    const formData = new FormData();
    images.forEach((zoneImages, i) => {
      zoneImages.forEach((data) => {
        formData.append('ids', selectedKey);
        formData.append('images', data);
        formData.append('index', i);
      });
    });
    await fetch('/uploadCategoryImage', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload response:', data);
        if (data.status === 200) {
          message.success(data.message)
        }else{
          message.error("Something Went Wrong")
        }
        setImages([])
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const columns = [
    {
      title: 'Category title',
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
      width: 300
    },
    {
      title: 'Image',
      dataIndex: 'Image',
      key: 'Image',
      width: 250,
      render: (text, record) => (
        <>
          <Button onClick={() => handleImageUpload(record._id)} className="text-white  hover:text-white bg-green-500 border-none hover:bg-green-600">Upload Image</Button>
          <Button onClick={() => viewImage(record._id)} className="text-white m-1 hover:text-white bg-blue-500 border-none hover:bg-blue-600">View</Button>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => handleUpdate(record._id)} className="text-white bg-green-500 border-none hover:bg-green-600 hover:text-white ">Edit</Button>
          <Button onClick={() => handleDelete(record._id)} className="text-white bg-red-500 border-none hover:bg-red-500 hover:text-white ml-2">Delete</Button>
        </>
      ),
    },
  ];

  const [form] = Form.useForm();
  const pageSize = 5;

  useEffect(() => {
    const callcategories = async () => {
      try {
        const req = await fetch('/getAllcategories', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(response => response.json())
          .then(jsonData => {
            setData(jsonData);
            setLoading(false);
            console.log(jsonData);
            const imgOBJ = {}
            jsonData.map(obj => {
              const { imageCategory } = obj;
              imgOBJ[obj._id] = { imageCategory }
            });

            // Set the filtered images in the displayImages state
            setDisplayImages(imgOBJ);
          }).catch(error => console.error(error))

      } catch (error) {
        console.log(error);
      }
    }
    callcategories();
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  function handleCreate() {
    form.resetFields();
    setModalVisible(true);
    setSelectedKey(null);
  }

  function handleUpdate(key) {
    const selectedRow = data.find(item => item._id === key);
    form.setFieldsValue(selectedRow);
    setModalVisible(true);
    setSelectedKey(key);
  }

  function viewImage(key) {
    setSelectedKey(key);
    const callcategories = async () => {
      try {
        const req = await fetch('/getAllcategories', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(response => response.json())
          .then(jsonData => {
            setData(jsonData);
            setLoading(false);
            console.log(jsonData);
            const imgOBJ = {}
            jsonData.map(obj => {
              const { imageCategory } = obj;
              imgOBJ[obj._id] = { imageCategory }
            });

            // Set the filtered images in the displayImages state
            setviewImageModal(true);
            const filteredImages = imgOBJ[key] || [];
            setonkeyDisplayImages(filteredImages)
          }).catch(error => console.error(error))

      } catch (error) {
        console.log(error);
      }
    }
    callcategories();

  }

  const okViewModal = () => {

  };

  const CancelViewModal = () => {
    setviewImageModal(false);
  };

  function handleDelete(key) {
    setSelectedKey(key);
    setDeleteModalVisible(true);
    // setData(data.filter(item => item.key !== key));
  }

  const handleDeleteModalOk = () => {
    setData(data.filter((item) => item._id !== selectedKey));
    setDeleteModalVisible(false);
    const DeleteCategory = async () => {
      try {
        const res = await fetch("/delete_category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            selectedKey
          })
        })
        const data = await res.json();
        if (data.status === 200) {
          message.success("Category Deleted Successfully")
        } else {
          message.error("Something Went Wrong")
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Caling Del Category Function
    DeleteCategory();

  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  function handleImageUpload(key) {
    setSelectedKey(key);
    setimageUploadModal(true);
  }

  const handleCancelImageUploadModal = () => {
    setimageUploadModal(false);
  };

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        form.resetFields();
        setModalVisible(false);

        if (selectedKey === null) {
          setData([
            ...data,
            {
              _id: data.length + 1,
              ...values,
            },
          ]);

          const addCategory = async () => {
            try {
              const res = await fetch("/add_category", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  values
                })
              })

              const data = await res.json();
              // console.log(data)
              if (data.status === 200) {
                message.success("Category Added Successfully")
              } else {
                message.error("Something Went Wrong")
              }

            } catch (error) {
              console.log(error)
            }
          }

          // Caling Add categorie Function
          addCategory();

        } else {
          setData(
            data.map(item =>
              item._id === selectedKey ? { ...item, ...values } : item
            )
          );
          // Update categorie Request 
          const updateCategory = async () => {
            try {
              const res = await fetch("/update_category", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  selectedKey, values
                })
              })

              const data = await res.json();
              if (data.status === 200) {
                message.success("categorie Updated Successfully")
              } else {
                message.error("Something Went Wrong")
              }
            } catch (error) {
              console.log(error)
            }
          }

          // Caling Add categories Function
          updateCategory();
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function ImageDisplay({ images }) {
    return (
      <div className='mt-5'>
        <h1 className='font-bold text-lg'>Category Image:</h1>
        {
          images.imageCategory === '' || images?.imageCategory === undefined ? <p>No Image Found</p> :

            <div id="imageCategory" className='overflow-hidden m-1 relative'>
              <img className='ml-2 border p-2 w-full h-full object-contain' src={`/uploads/category/${images?.imageCategory}`} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute top-0 right-0 m-1 cursor-pointer bg-red-500 rounded-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                onClick={() => handleCategoryImage(images?.imageCategory)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
        }
      </div>


    );
  }

  const handleCategoryImage = async (imageUrl) => {
    try {
      // Send a request to the backend to delete the image from MongoDB
      const response = await fetch('/deleteCategoryImage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, selectedKey }),
      });

      if (response.ok) {
        // Image deleted successfully, perform any necessary UI updates
        console.log('Image deleted successfully');
        message.success("Image deleted successfully")
        document.getElementById("imageCategory").innerHTML = 'No Image Found...'
      } else {
        // Handle error response from the backend
        console.log('Error deleting image');
      }
    } catch (error) {
      // Handle any network or server errors
      console.log('Error deleting image:', error);
    }
  };
  return (
    <main>
      <div className="mx-auto p-5 mt-10">
        <h1 className='text-4xl text-gray-300 font-bold mb-2'>Category</h1>
        <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
          <NavLink to={`${AdminUrl}`}>
            <a href= "" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
          </NavLink>

          <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
          <p className="text-slate-500 hover:text-slate-600">Manage Category</p>
        </nav>
        {
          Loading ? "Table Loading" :
            <>
              <div className='flex justify-center'>
                <Button onClick={handleCreate} className="text-gray-300">Add New Category</Button>
              </div>
              <div className='table-responsive overflow-hidden overflow-x-auto'>
                <Table columns={columns}
                  dataSource={data?.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                  pagination={false}
                  className="w-full mt-10"
                  rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />

                <div className="mt-4">
                  <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    pageSize={pageSize}
                    total={data?.length}
                  />
                </div>
              </div>
              <Modal
                title={selectedKey === null ? 'Create Category' : 'Update Category'}
                visible={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                okButtonProps={{ disabled: false }}
              >
                <Form form={form} className="mt-2">
                  <Form.Item name="category_name" label="Category Name" rules={[{ required: true, message: 'Please enter the Category name' }]}>
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
              >
                <p>Are you sure you want to delete this row?</p>
              </Modal>

              <Modal
                title="Image Upload"
                visible={imageUploadModal}
                onOk={handleImageUploadModal}
                onCancel={handleCancelImageUploadModal}
                okText="Upload"
              >
                <div className='flex flex-wrap justify-center'>
                  {renderDropZone(0)}
                </div>
              </Modal>

              <Modal
                title={`List of Images - ${selectedKey}`}
                visible={viewImageModal}
                onOk={okViewModal}
                onCancel={CancelViewModal}
              >
                <ImageDisplay images={onkeyDisplayImages} />
              </Modal>
            </>
        }
      </div>
    </main>
  )
}

export default Category