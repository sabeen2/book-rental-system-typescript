import React from "react";
import { Button, Form, Space, Select, DatePicker } from "antd";
import { RentData, MemberData } from "../../staticdata";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ReturnForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="bg-grey-200 p-6 rounded">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please select the code" }]}
        >
          <Select className="w-full" placeholder="Select code">
            {RentData.map((rent) => (
              <Option key={rent.key} value={rent.key}>
                {rent.code}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Date of Request"
          name="date_of_request"
          rules={[
            { required: true, message: "Please select the date of request" },
          ]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          label="Date of Return"
          name="date_of_return"
          rules={[
            { required: true, message: "Please select the date of return" },
          ]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          label="Member"
          name="member"
          rules={[{ required: true, message: "Please select the member" }]}
        >
          <Select className="w-full" placeholder="Select member">
            {MemberData.map((member) => (
              <Option key={member.key} value={member.key}>
                {member.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please enter the status" }]}
        >
          <Select className="w-full" placeholder="Select status">
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Rent Status"
          name="rent_status"
          rules={[{ required: true, message: "Please enter the rent status" }]}
        >
          <Select className="w-full" placeholder="Select rent status">
            <Option value="rented">Rented</Option>
            <Option value="returned">Returned</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400 text-white font-bold px-4  rounded-full"
              type="default"
              htmlType="submit"
            >
              Submit
            </Button>
            <Button
              className="border border-gray-900 py-1 px-5 rounded-full"
              htmlType="button"
              onClick={onReset}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ReturnForm;
