import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  Upload,
  message,
  // Upload,
} from "antd";
// import { UploadOutlined } from "@ant-design/icons";

import { UploadOutlined } from "@ant-design/icons";
import { useAddMember, useUploadMemberDetails, useupdateMember } from "../../api/members/queries";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface MemberDataType {
  memberid: string;
  name: string;
  email: string;
  mobileNo: string;
  address: string;

}

interface CreateMemberProps {
  selectedMember?: MemberDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateMember: React.FC<CreateMemberProps> = ({
  selectedMember,
  form,
  onSucess,
}) => {
  const { mutate: addMember, isLoading: isAddingMember } = useAddMember();

  const onFinish = (values: any) => {
    let payload:any = {
      name: values.name,
      email: values.email,
      mobileNo: values.mobileNo,
      address: values.address,
    }
    if(selectedMember) {
      console.log(payload)
      payload = {...payload, memberid :selectedMember.memberid}
      console.log(payload)

    }
    selectedMember
      ? editMember(payload,{
        onSuccess: () => {
          message.success(`Edited member Sucessfully:  ${values.name}`);
          onSucess();
        },
      })
      : addMember(
          payload,
          {
            onSuccess: () => {
              message.success(`Added member Sucessfully:  ${values.name}`);
              onSucess();
            },
          }
        );
  };

  
  const onReset = () => {
    form.resetFields();
  };

  const [fileList, setFileList] = useState<any[]>([]);
const { mutate: uploadMember } = useUploadMemberDetails();


 const uploadProps = {
    name: "file",
    fileList: fileList,
    action: "",
    beforeUpload: (file: File) => {
      setFileList([file]);
      handleUpload(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleUpload = (file: File) => {
    uploadMember({ file }, {
      onSuccess: () => {
        setFileList([]); 
        onSucess();
        message.success("Uploaded Sucessfully");
      },
      onError: () => {
       
        message.error(`Error Uploading `);
      },
    });
  };


  const { mutate: editMember } = useupdateMember();

  useEffect(() => {
    if (selectedMember) {
      form.setFieldsValue({
        name: selectedMember.name,
        email: selectedMember.email,
        mobileNo: selectedMember.mobileNo,
        address: selectedMember.address,
      });
    }
  }, [selectedMember, form]);

  return (
    <div className="bg-white p-6 rounded">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
         <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobileNo"
          rules={[
            { required: true, message: "Please enter the mobile number" },
            {
              pattern: /^[0-9]*$/,
              message: "Please enter a valid mobile number",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter the Address" }]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item label="Upload Member Data" {...tailLayout}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Excel</Button>
          </Upload>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400 text-white font-bold px-4 rounded-full"
              type="default"
              htmlType="submit"
              loading={isAddingMember}
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

export default CreateMember;
