import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select, Table, TableProps, message } from "antd";
import axios from "axios"; 
import { BASE_API_ENDPOINT } from "../../config/api.config";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [passform] = Form.useForm();
  const [addform] = Form.useForm();

  const currentUser = localStorage.getItem('userName');
  const token = localStorage.getItem('bookRental');

  type FieldType = {
    id: number;
    username?: string;
    password?: string;
    userType?: string;
    deleted?: boolean;
  };

  useEffect(() => {
    fetchUserData();
  }, []); 

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_ENDPOINT}/admin/user/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (record: FieldType) => {
    try {
      const response = await axios.delete(
        `${BASE_API_ENDPOINT}/admin/user/deactivate?id=${record.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      message.success(response.data.message);
      const updatedUserData = userData.filter((user: FieldType) => user.id !== record.id);
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error deactivating user:", error);
      message.error("Failed to deactivate user");
    }
  };

  const handleActivate = async (record: FieldType) => {
    try {
      const response = await axios.post(
        `${BASE_API_ENDPOINT}/admin/user/reactivate?id=${record.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      message.success(response.data.message);
      fetchUserData();
    } catch (error) {
      console.error("Error activating user:", error);
      message.error("Failed to activate user");
    }
  };

const onFinish = async (values: FieldType) => {
    try {
      const response = await axios.post(
        `${BASE_API_ENDPOINT}/admin/user/add-user`,
        {
          username: values.username,
          password: values.password,
          userType: values.userType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      message.success(response.data.message);
      addform.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding new user:", error);
      message.error("Failed to add new user");
    }
  };

  const onChangePass = async (values: any) => {
    try {
      const response = await axios.post(
        `${BASE_API_ENDPOINT}/admin/user/reset`,
       
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      message.success("Password changed successfully");
      passform.resetFields();
        
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Failed to change password");
    }
  };

 
  const columns: TableProps<FieldType>["columns"] = [
    {
      title: "UserID",
      dataIndex: "id",
      key: "id",
      className: "px-4 py-2",
      sorter: (a: any, b: any) => a.id - b.id,
      sortDirections: ["descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
      className: "px-4 py-2",
    },
    {
      title: "UserType",
      dataIndex: "userType",
      key: "userType",
      className: "px-4 py-2",
    },
    {
      title: 'Status',
          key: 'status',
          render: (_, record) => (
            <span style={{ color: record.deleted ? 'red' : 'green' }}>
              {record.deleted ? 'Inactive' : 'Active'}
            </span>
          ),
          className: 'px-4 py-2',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <>
              {record.deleted ? (
                <Button
                  type="primary"
                  style={{ backgroundColor: 'green', color: 'white', borderRadius: '20px', fontWeight: 'bold' , width: '100px' }}
                  onClick={() => handleActivate(record)}
                >
                    Activate    
                </Button>
              ) : (
                <Button
                  type="primary"
                  danger
                  style={{ backgroundColor: 'red', color: 'white', borderRadius: '20px', fontWeight: 'bold',width: '100px' }}
                  onClick={() => handleDelete(record)}
                >
                  Deactivate
                </Button>
              )}
            </>
          ),
          className: 'px-4 py-2',
    },
  ];

  return (
    <>
      <div className="flex-grow mx-10 mt-10">
        <Button
          type="default"
          onClick={showModal}
          className="bg-blue-500 text-white font-bold px-2 mt-4 rounded mb-4"
        >
          Add User
        </Button>
    
        <Modal
          title="User Details"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={addform}
            name="signup"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                placeholder="Username"
                className="rounded-md mb-4 border focus:outline-none border-gray-900 focus:border-purple-500 px-3 py-2"
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className=" border-gray-900 rounded-md mb-4 border focus:outline-none focus:border-purple-500 px-3 py-2"
              />
            </Form.Item>

            <Form.Item
              name="userType"
              rules={[{ required: true, message: "Please select a role!" }]}
            >
              <Select
                placeholder="Select a role"
                options={[
                  { value: "ADMIN", label: "Admin" },
                  { value: "LIBRARIAN", label: "Librarian" },
                ]}
                className="w-full border border-gray-900 rounded"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-purple-500 hover:from-gray-900 hover:to-black text-white font-bold  px-4 rounded-md focus:outline-none transition-all duration-300 w-full"
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Table columns={columns} pagination={{ pageSize: 5, responsive: true }} dataSource={userData} bordered />

      
        {/* end */}

        <div className="flex-auto w-50 mx-auto"></div>
      </div>
    </>
  );
};

export default App;
