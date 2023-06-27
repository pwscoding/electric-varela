import React, { useState, useEffect} from 'react'
import { Table, Button, Modal, Form, Input, message, Pagination, Select, InputNumber, Upload, Image, DatePicker, TimePicker } from 'antd';
import { NavLink } from 'react-router-dom'

const ServiceCategory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [data, setData] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const AdminUrl = "/Admin"
  const columns = [
    {
      title: 'Service Category title',
      dataIndex: 'service_category_name',
      key: 'service_category_name',
      sorter: (a, b) => a.service_category_name.localeCompare(b.service_category_name),
      width: 300
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
        const req = await fetch('/getAllServicecategories', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(response => response.json())
          .then(jsonData => {
            setData(jsonData);
            setLoading(false);
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
        const res = await fetch("/delete_service_category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            selectedKey
          })
        })
        const data = await res.json();
        if (data.status===200) {
          message.success("Service Category Deleted Successfully")
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
              const res = await fetch("/add_service_category", {
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
                message.success("Service Category Added Successfully")
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
              const res = await fetch("/update_service_category", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  selectedKey, values
                })
              })

              const data = await res.json();
              if (data.status===200) {
                message.success("Service category Updated Successfully")
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

  return (
    <main>
      <div className="mx-auto p-5 mt-10">
        <h1 className='text-4xl text-gray-300 font-bold mb-2'>Service Category</h1>
        <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
          <NavLink to={`${AdminUrl}`}>
            <a href= "" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
          </NavLink>

          <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
          <p className="text-slate-500 hover:text-slate-600">Manage Service Category</p>
        </nav>
        {
          Loading ? "Table Loading" :
            <>
              <div className='flex justify-center'>
                <Button onClick={handleCreate} className="text-gray-300">Add New Service Category</Button>
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
                title={selectedKey === null ? 'Create Service Category' : 'Update Service Category'}
                visible={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                okButtonProps={{ disabled: false }}
              >
                <Form form={form} className="mt-2">
                  <Form.Item name="service_category_name" label="Service Category Name" rules={[{ required: true, message: 'Please enter the Category name' }]}>
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

            </>
        }
      </div>
    </main>
  )
}

export default ServiceCategory