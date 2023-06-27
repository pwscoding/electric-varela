import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, message, Pagination, Select, InputNumber, Upload, Image, DatePicker, TimePicker } from 'antd';
import { NavLink } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';

const Product = () => {
  const { TextArea } = Input;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [data, setData] = useState();
  const [categoryList, setCategoryList] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [imageUploadModal, setimageUploadModal] = useState(false);
  const [viewImageModal, setviewImageModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [DisplayImages, setDisplayImages] = useState([]);
  const [onkeyDisplayImages, setonkeyDisplayImages] = useState([]);
  const [ctaChecked, setctaChecked] = useState();

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
    await fetch('/uploadProductImage', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload response:', data);
        if (data.status === 400) {
          message.error(data.message)
        }
        setImages([])
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
      width: 100
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100

    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      sorter: (a, b) => a.color.localeCompare(b.color),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      sorter: (a, b) => a.size.localeCompare(b.size),
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      sorter: (a, b) => a.material.localeCompare(b.material),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      sorter: (a, b) => a.weight.localeCompare(b.weight),
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
    const callProducts = async () => {
      try {
        const req = await fetch('/getAllProducts', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(response => response.json())
          .then(jsonData => {
            setData(jsonData);
            setLoading(false);

            const imagesObject = {};

            for (let i = 0; i < 6; i++) {
              const imagesProp = `images${i}`;

              jsonData.forEach(item => {
                if (item.hasOwnProperty(imagesProp) && Array.isArray(item[imagesProp])) {
                  const id = item._id;
                  if (!imagesObject.hasOwnProperty(id)) {
                    imagesObject[id] = [];
                  }
                  imagesObject[id].push(...item[imagesProp]);
                }
              });
            }

            // Set the images object state
            setDisplayImages(imagesObject);
          }).catch(error => console.error(error))

      } catch (error) {
        console.log(error);
      }
    }
    callProducts();

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
            setCategoryList(jsonData);
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
    setctaChecked(selectedRow.cta)
  }

  console.log(ctaChecked);
  function viewImage(key) {
    setSelectedKey(key);
    const callProducts = async () => {
      try {
        const req = await fetch('/getAllProducts', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(response => response.json())
          .then(jsonData => {
            setData(jsonData);
            setLoading(false);

            const imagesObject = {};

            for (let i = 0; i < 6; i++) {
              const imagesProp = `images${i}`;

              jsonData.forEach(item => {
                if (item.hasOwnProperty(imagesProp) && Array.isArray(item[imagesProp])) {
                  const id = item._id;
                  if (!imagesObject.hasOwnProperty(id)) {
                    imagesObject[id] = [];
                  }
                  imagesObject[id].push(...item[imagesProp]);
                }
              });
            }

            // Set the images object state
            setviewImageModal(true);
            const filteredImages = imagesObject[key] || [];
            setonkeyDisplayImages(filteredImages)
          }).catch(error => console.error(error))

      } catch (error) {
        console.log(error);
      }
    }
    callProducts();

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
    const DeleteProduct = async () => {
      try {
        const res = await fetch("/delete_product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            selectedKey
          })
        })

        const data = await res.json();
        // console.log(data)
        if (data.status === 200) {
          message.success("Product Deleted Successfully")
        } else {
          message.error("Something Went Wrong")
        }

      } catch (error) {
        console.log(error)
      }
    }

    // Caling Add Product Function
    DeleteProduct();

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
        console.log(values);
        if (selectedKey === null) {
          setData([
            ...data,
            {
              _id: data.length + 1,
              ...values,
            },
          ]);

          const addProduct = async () => {
            try {
              const res = await fetch("/add_product", {
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
                message.success("Product Added Successfully")
              } else {
                message.error("Something Went Wrong")
              }

            } catch (error) {
              console.log(error)
            }
          }

          // Caling Add Product Function
          addProduct();

        } else {
          console.log('update');
          setData(
            data.map(item =>
              item._id === selectedKey ? { ...item, ...values } : item
            )
          );
          // Update Product Request 
          const updateProduct = async () => {
            try {
              const res = await fetch("/update_product", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  selectedKey, values
                })
              })

              const data = await res.json();
              // console.log(data)
              if (data.status === 200) {
                message.success("Product Updated Successfully")
              } else {
                message.error("Something Went Wrong")
              }

            } catch (error) {
              console.log(error)
            }
          }

          // Caling Add Product Function
          updateProduct();
        }
      })

      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function ImageDisplay({ images }) {
    return (
      <div className='flex flex-row flex-wrap w-100 justify-center mt-2'>
        {images.map((imageUrl, index) => {
          return (
            imageUrl === '' ? " " : 
            <div id={`images${index}`} className='w-[100px] h-[100px] overflow-hidden m-1 relative'>
              <img key={index} className='ml-2 border p-2 w-full h-full object-contain' src={`/uploads/products/${imageUrl}`} alt={`Image ${index}`} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute top-0 right-0 m-1 cursor-pointer bg-red-500 rounded-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                onClick={() => handleDeleteProductImage(imageUrl, `images${index}`)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
  
          )
        })}
      </div>
    );
  }

  const handleDeleteProductImage = async (imageUrl, imageIndex) => {
    try {
      // Send a request to the backend to delete the image from MongoDB
      const response = await fetch('/deleteProductImage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, selectedKey, imageIndex }),
      });
  
      if (response.ok) {
        // Image deleted successfully, perform any necessary UI updates
        console.log('Image deleted successfully');
        message.success("Image deleted successfully")
        document.getElementById(imageIndex).style.display = 'none'
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
        <h1 className='text-4xl text-gray-300 font-bold mb-2'>Products</h1>
        <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
          <NavLink to={`${AdminUrl}`}>
            <a  href= "" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
          </NavLink>

          <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
          <p className="text-slate-500 hover:text-slate-600">Manage Products</p>
        </nav>
        {
          Loading ? "Table Loading" :
            <>
              <div className='flex justify-center'>
                <Button onClick={handleCreate} className="text-gray-300">Add New Product</Button>
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
                title={selectedKey === null ? 'Create Product' : 'Update Product'}
                visible={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                okButtonProps={{ disabled: false }}
              >
                <Form form={form} className="mt-2">
                  <Form.Item name="product_name" label="product_name" rules={[{ required: true, message: 'Please enter the product name' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="description" rules={[{ required: true, message: 'Please enter the product Description' }]}>
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item name="price" label="price" rules={[{ required: true, message: 'Please enter the price' }]}>
                    <InputNumber className='w-full' min={0} />
                  </Form.Item>
                  <Form.Item name="quantity" label="quantity" rules={[{ required: true, message: 'Please enter the quantity' }]}>
                    <InputNumber className='w-full' min={0} />
                  </Form.Item>
                  <Form.Item name="category" label="category" rules={[{ required: true, message: 'Please select a category' }]}>
                    <Select>
                      {
                        categoryList?.map((item, i) => {
                          return <>
                            <Option className="flex" value={item.category_name}>
                              {item.category_name}
                            </Option>
                          </>
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item name="color" label="color" rules={[{ required: true, message: 'Please enter the color code' }]}>
                    <Input type="color  " />
                  </Form.Item>
                  <Form.Item name="size" label="size" rules={[{ required: true, message: 'Please enter the product width and height ' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="material" label="material" rules={[{ required: true, message: 'Please enter the material' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="weight" label="weight" rules={[{ required: true, message: 'Please enter the weight' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="cta" label="Call to Action Btn" rules={[{ required: true, message: 'Please select any one cta' }]}>
                    <div className='flex gap-5'>
                      <div className="flex items-center">
                        <input type="radio" id="cta1" name="cta" value={0} className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent"
                          checked={ctaChecked === "0" && ctaChecked != undefined ? "checked" : undefined}
                        />
                        <label htmlFor="cta1" className="ml-2">Add to Cart</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="cta2" name="cta" value={1} className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent"
                          checked={ctaChecked === "1" && ctaChecked != undefined ? "checked" : undefined}
                        />
                        <label htmlFor="cta2" className="ml-2">Get Inquiry</label>
                      </div>
                    </div>
                    {/* Add more radio buttons as needed */}
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
                <h1>Note: After Uploading each images click on upload</h1>
                <div className='flex flex-wrap justify-center'>
                  {renderDropZone(0)}
                  {renderDropZone(1)}
                  {renderDropZone(2)}
                  {renderDropZone(3)}
                  {renderDropZone(4)}
                  {renderDropZone(5)}
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

export default Product