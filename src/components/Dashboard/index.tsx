import { Button, Form, Input, Layout, Modal, Select, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import AuthorSetup from "../../pages/Author/AuthorSetup";
import BookSetup from "../../pages/Book/BookSetup";
import Rent from "../../pages/Rent/Rent";
import CategorySetup from "../../pages/Category/CategorySetup";
import Manage from "../../pages/ManageUsers/Manage";
import MemberSetup from "../../pages/Member/MemberSetup";

import Charts from "../../pages/Charts";
import { useEffect, useState } from "react";
// import SendMail from "../../pages/Member/SendMail";
import Return from "../../pages/Return/Return";
import { BASE_API_ENDPOINT } from "../../config/api.config";
import axios from "axios";
import { useFetchAuthor } from "../../api/author/queries";

const { Header: AntHeader } = Layout;

const Dashboard: React.FC = () => {
  const { loggedIn, logout, isExpired } = useAuth();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passform] = Form.useForm();
  const token = localStorage.getItem("bookRental");

  useEffect(() => {
    const userToken = localStorage.getItem("bookRental");
    const getUserInfoFromToken = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedData = JSON.parse(atob(base64));
        return {
          username: decodedData.sub,
          exp: decodedData.exp,
          role: decodedData.role,
        };
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
      }
    };

    if (userToken) {
      const userInfo = getUserInfoFromToken(userToken);
      if (userInfo) {
        const { username, role } = userInfo;
        setCurrentRole(role);
        setCurrentUser(username);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", username);
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
    } else {
      setCurrentUser(null);
      setCurrentRole(null);
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  type FieldType = {
    id: number;
    username?: string;
    password?: string;
    userType?: string;
    deleted?: boolean;
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
      console.log(response);
      message.success("Password changed successfully");
      passform.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Failed to change password");
    }
  };

  return (
    <>
      <Layout>
        <AntHeader className="bg-indigo-800 text-white flex items-center justify-between p-4">
          <Link to="/dashboard" className="text-2xl font-bold">
            Book Rental System{" "}
          </Link>
          <div className="flex items-center space-x-4">
            <div
              className="cursor-pointer transform hover:scale-110 transition-transform"
              title="Profile"
              onClick={showModal}
            >
              {" "}
              <UserOutlined className="text-xl text-yellow-500" />{" "}
              <span className="ml-2 mr-4 text-sm">
                {currentUser} ({currentRole})
              </span>
            </div>

            <div
              className="cursor-pointer transform hover:scale-110 transition-transform"
              title="Logout"
              onClick={() => {
                logout();
              }}
            >
              {" "}
              <LogoutOutlined className="text-xl text-red-500" />{" "}
              <span className="ml-2 text-sm">Logout</span>
            </div>
          </div>
        </AntHeader>

        <div className="flex">
          <div>
            <Sidebar />
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <Navigate to={loggedIn ? "/dashboard" : "/login"} replace />
              }
            />

            <Route path="author-setup" element={<AuthorSetup />} />
            <Route path="author-setup" element={<AuthorSetup />} />
            <Route path="category-setup" element={<CategorySetup />} />
            <Route path="member-setup" element={<MemberSetup />} />
            <Route path="book-setup" element={<BookSetup />} />
            <Route path="rent-book" element={<Rent />} />
            <Route path="return-book" element={<Return />} />
            <Route
              path="manage-users"
              element={
                currentRole === "ADMIN" ? (
                  <Manage />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
          </Routes>

          {location.pathname === "/dashboard" && <Charts />}
        </div>
      </Layout>

      <Modal
        title="Change Password"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <Form
          form={passform}
          name="change-password"
          onFinish={onChangePass}
          className="mt-8 space-y-8"
          style={{ width: "80%", margin: "auto" }}
        >
          <Form.Item
            label={
              <span className="text-lg font-semibold text-gray-900">
                Old Password
              </span>
            }
            name="oldPassword"
            rules={[
              { required: true, message: "Please input your old password!" },
            ]}
          >
            <Input.Password
              className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-5 text-base text-gray-800 placeholder-gray-500"
              placeholder="Enter your old password"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-lg font-semibold text-gray-900">
                New Password
              </span>
            }
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password
              className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-5 text-base text-gray-800 placeholder-gray-500"
              placeholder="Enter your new password"
            />
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              className=" bg-purple-500 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-10 rounded-lg shadow-md transition duration-300"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Dashboard;
