import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Table, Button, Modal, Form, Input, message, Pagination, Select, InputNumber, Upload, Image, DatePicker, TimePicker } from 'antd';
import { NavLink } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';;

const Services = ({ placeholder }) => {
  const { TextArea } = Input;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [data, setData] = useState();
  const [descriptionCkeditor, setdescriptionCkeditor] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [descriptionModal, setdescriptionModal] = useState(false);
  const [imageUploadModal, setimageUploadModal] = useState(false);
  const [viewImageModal, setviewImageModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [DisplayImages, setDisplayImages] = useState([]);
  const [onkeyDisplayImages, setonkeyDisplayImages] = useState([]);
  const [ServicecategoryList, setServiceCategoryList] = useState();
  const [imageLoader, setimageLoader] = useState(false);

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
    setimageLoader(true)
    const formData = new FormData();
    images.forEach((zoneImages, i) => {
      zoneImages.forEach((data) => {
        formData.append('ids', selectedKey);
        formData.append('images', data);
        formData.append('index', i);
      });
    });
    await fetch('/uploadServiceImage', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload response:', data);
        if (data.status === 200) {
          message.success(data.message)
        } else {
          message.error("Something Went Wrong")
        }
        setImages([])
        setimageLoader(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const columns = [
    {
      title: 'Service title',
      dataIndex: 'service_title',
      key: 'service_title',
      sorter: (a, b) => a.service_title.localeCompare(b.service_title),
      width: 100
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text, record) => (
        <>
          <Button onClick={() => handleDescription(record._id)} className="text-white  hover:text-white bg-green-500 border-none hover:bg-green-600">View</Button>
        </>
      ),
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
      title: 'Category',
      dataIndex: 'service_category_name',
      key: 'service_category_name',
      sorter: (a, b) => a.service_category_name.localeCompare(b.service_category_name),
      width: 100
    },
    {
      title: 'Contact Details',
      dataIndex: 'contactTitle',
      key: 'contactTitle',
      width: 100
    },
    {
      title: 'Contact Description',
      dataIndex: 'contactDescription',
      key: 'contactDescription',
      width: 100

    },
    {
      title: 'CONTACT NUMBER',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
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

  const callServices = async () => {
    try {
      const req = await fetch('/getAllServices', {
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
            const { imageBreadcrumb, imageBody } = obj;
            imgOBJ[obj._id] = { imageBreadcrumb, imageBody }
          });

          // Set the filtered images in the displayImages state
          setDisplayImages(imgOBJ);
        }).catch(error => console.error(error))

    } catch (error) {
      console.log(error);
    }
  }

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
          setServiceCategoryList(jsonData);
        }).catch(error => console.error(error))

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    callServices();

    callcategories();
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  function handleCreate() {
    form.resetFields();
    form.setFieldsValue({ contactTitle: 'Need any help ?', contactDescription: 'Empowering Solutions at Your Fingertips: Reach Out for Expert Electric Service.', contactNumber: '9865745285' });
    setdescriptionCkeditor('');
    setModalVisible(true);
    setSelectedKey(null);
  }

  function handleDescription(key) {
    callServices();
    const selectedRow = data.find(item => item._id === key);
    setdescriptionCkeditor(selectedRow.description);
    setSelectedKey(key);
    setdescriptionModal(true);
  }

  function cancelDescriptionModal() {
    setdescriptionModal(false);
  }

  function handleUpdate(key) {
    const selectedRow = data.find(item => item._id === key);
    form.setFieldsValue(selectedRow);
    setdescriptionCkeditor(selectedRow.description);
    setModalVisible(true);
    setSelectedKey(key);
  }

  function viewImage(key) {
    setSelectedKey(key);
    const callImageServices = async () => {
      try {
        const req = await fetch('/getAllServices', {
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
              const { imageBreadcrumb, imageBody } = obj;
              imgOBJ[obj._id] = { imageBreadcrumb, imageBody }
            });

            // Set the filtered images in the displayImages state
            const filteredImages = imgOBJ[key] || [];
            setonkeyDisplayImages(filteredImages)
            setDisplayImages(imgOBJ);
            setviewImageModal(true);
          }).catch(error => console.error(error))

      } catch (error) {
        console.log(error);
      }
    }
    callImageServices();
  }

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
    const DeleteService = async () => {
      try {
        const res = await fetch("/delete_service", {
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
          message.success("Service Deleted Successfully")
        } else {
          message.error("Something Went Wrong")
        }
      } catch (error) {
        console.log(error)
      }
    }
    // Caling Del Service Function
    DeleteService();

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

          const addServices = async () => {
            try {
              const res = await fetch("/add_service", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  values, descriptionCkeditor
                })
              })

              const data = await res.json();
              // console.log(data)
              if (data.status === 200) {
                message.success("Service Added Successfully")
                callServices();
                console.log('hello');
              } else {
                message.error("Something Went Wrong")
              }

            } catch (error) {
              console.log(error)
            }
          }

          // Caling Add Service Function
          addServices();

        } else {
          console.log(descriptionCkeditor);
          setData(
            data.map(item =>
              item._id === selectedKey ? { ...item, ...values } : item
            )
          );
          // Update Service Request 
          const updateService = async () => {
            try {
              const res = await fetch("/update_service", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  selectedKey, values, descriptionCkeditor
                })
              })

              const data = await res.json();
              // console.log(data)
              if (data.status === 200) {
                message.success("Service Updated Successfully")
                callServices();
              } else {
                message.error("Something Went Wrong")
              }

            } catch (error) {
              console.log(error)
            }
          }

          // Caling Add Service Function
          updateService();
        }
      })

      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function ImageDisplay({ images }) {
    return (
      <div className='mt-5'>
        <h1 className='font-bold text-lg'>Body Image:</h1>
        {

          images.imageBody === '' || images?.imageBody === undefined ? <p>No Image Found</p> :

            <div id="imageService" className='overflow-hidden m-1 relative'>
              <img className='ml-2 border p-2 w-full h-full object-contain' src={`/uploads/services/${images?.imageBody}`} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute top-0 right-0 m-1 cursor-pointer bg-red-500 rounded-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                onClick={() => handleDeleteServiceImage(images?.imageBody)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
        }
      </div>
    );
  }

  const handleDeleteServiceImage = async (imageUrl) => {
    try {
      // Send a request to the backend to delete the image from MongoDB
      const response = await fetch('/deleteServiceImage', {
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
        document.getElementById("imageService").innerHTML = 'No Image Found...'
      } else {
        // Handle error response from the backend
        console.log('Error deleting image');
      }
    } catch (error) {
      // Handle any network or server errors
      console.log('Error deleting image:', error);
    }
  };

  useEffect(() => {
    ClassicEditor.create(document.querySelector('#editor-root'))
      .then(editor => {
        console.log('Editor successfully initialized', editor);
      })
      .catch(error => {
        console.error('Error initializing editor:', error);
      });
  }, []);
  return (
    <main>
      <div className="mx-auto p-5 mt-10">
        <h1 className='text-4xl text-gray-300 font-bold mb-2'>Services</h1>
        <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
          <NavLink to={`${AdminUrl}`}>
            <a href="" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
          </NavLink>


          <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
          <p className="text-slate-500 hover:text-slate-600">Manage Services</p>
        </nav>
        {
          Loading ? "Table Loading" :
            <>
              <div className='flex justify-center'>
                <Button onClick={handleCreate} className="text-gray-300">Add New Service</Button>
              </div>
              <div className='table-responsive overflow-hidden overflow-x-auto'>
                <Table columns={columns}
                  dataSource={data?.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                  pagination={false}
                  className="w-full mt-10"
                  rowClassName="dark:bg-secondary-dark-bg  no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />

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
                title={selectedKey === null ? 'Create Service' : 'Update Service'}
                visible={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                okButtonProps={{ disabled: false }}
              >
                <Form form={form} className="mt-2">
                  <Form.Item name="service_title" label="service_title" rules={[{ required: true, message: 'Please enter the Service name' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="Description">
                    <div id="editor-root">
                      <CKEditor
                        editor={ClassicEditor}
                        data={descriptionCkeditor}
                        onReady={editor => {
                          // You can store the "editor" and use when it is needed.
                          console.log('Editor is ready to use!!', editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setdescriptionCkeditor(data)
                        }}
                        onBlur={(event, editor) => {
                          console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log('Focus.', editor);
                        }}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item name="service_category_name" label="Service Category Name" rules={[{ required: true, message: 'Please select a category' }]}>
                    <Select>
                      {
                        ServicecategoryList?.map((item, i) => {
                          return <>
                            <Option className="flex" value={item.service_category_name}>
                              {item.service_category_name}
                            </Option>
                          </>
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item name="contactTitle" label="Contact title" rules={[{ required: true, message: 'Please enter Contact Details' }]}>
                    <Input className='w-full' />
                  </Form.Item>
                  <Form.Item name="contactDescription" label="Contact Description" rules={[{ required: true, message: 'Please enter the Contact Description' }]}>
                    <Input className='w-full' />
                  </Form.Item>
                  <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, message: 'Please enter the Contact Number' }]}>
                    <InputNumber min={10} className='w-full' />
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
                {imageLoader &&
                  <div role="status">
                    <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                }
              </Modal>

              <Modal
                title={`List of Images - ${selectedKey}`}
                visible={viewImageModal}
                onCancel={CancelViewModal}
              >
                <ImageDisplay images={onkeyDisplayImages} />
              </Modal>

              {/* Description View  */}
              <Modal
                title={`Description - ${selectedKey}`}
                visible={descriptionModal}
                onCancel={cancelDescriptionModal}
              >
                <div dangerouslySetInnerHTML={{ __html: descriptionCkeditor }} className="mt-10"></div>
              </Modal>
            </>
        }
      </div>
    </main>
  )
}

export default Services