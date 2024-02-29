import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Link,  useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthContext';
import { useLogin } from '../../api/user/queries';


const LoginForm: React.FC = () => {
  const { loggedIn, login } = useAuth();
  const navigate = useNavigate();

  const {isLoading} = useLogin()

  const onFinish = async (values: any) => {
    await login(values.username, values.password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/dashboard');
    }
  }, [loggedIn, navigate]);

  return (
   
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 bg-white rounded-lg p-8 flex flex-col justify-between shadow-md">
      <p className=" text-center mb-6 text-gray-800 font-bold">UserName: bibek <br /> pass: 1234</p>
        <h1 className="text-3xl text-center mb-6 text-gray-800 font-bold">Login</h1>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              placeholder="Enter Username"
              className="border-gray-900 rounded-md mb-4 border focus:outline-none focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              className="border-gray-900 rounded-md mb-4 border focus:outline-none focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading= {isLoading}
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-2 px-4 rounded-md focus:outline-none transition-all duration-300 w-full"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          Forgot Password?? <Link to="/forgot-password" className="text-blue-500">Reset Password</Link>
        </div>
      </div>
    </div>
    
  );
};

export default LoginForm;

