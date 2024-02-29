import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  useAddAuthor,
  useUploadAuthorDetails,
  useupdateAuthor,
} from "../../api/author/queries";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface AuthorDataType {
  authorId: any;
  name: string;
  email: string;
  mobileNumber: string;
}

interface CreateAuthorProps {
  setSelectedAuthor?: AuthorDataType | null | undefined;
  selectedAuthor?: AuthorDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateAuthor: React.FC<CreateAuthorProps> = ({
  selectedAuthor,
  form,
  onSucess,
}) => {
  const { mutate: addAuthor, isLoading: isAddingAuthor } = useAddAuthor();
  const { mutate: editAuthor } = useupdateAuthor();

  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = (values: any) => {
    let payload: any = {
      name: values.name,
      email: values.email,
      mobileNumber: values.mobileNumber,
    };
    if (selectedAuthor) {
      payload = { ...payload, authorId: selectedAuthor.authorId };
    }
    selectedAuthor
      ? editAuthor(payload, {
          onSuccess: () => {
            message.success(`Edited author Sucessfully:  ${values.name}`);
            onSucess();
          },
          onError:(errorMessage)=> { message.error(`Failed Editing: ${errorMessage}`)}
        })
      : addAuthor(payload, {
          onSuccess: () => {
            message.success(`Added author Sucessfully:  ${values.name}`);
            onSucess();
          },
          onError:(errorMessage)=> { message.error(`Failed Creating ${errorMessage}`)}
        });
  };

  const onReset = () => {
    form.resetFields();
  };

  const { mutate: uploadAuthor } = useUploadAuthorDetails();

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
    uploadAuthor({ file }, {
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

  useEffect(() => {
    if (selectedAuthor) {
      form.setFieldsValue({
        name: selectedAuthor.name,
        email: selectedAuthor.email,
        mobileNumber: selectedAuthor.mobileNumber,
      });
    }
  }, [selectedAuthor, form]);

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
          name="mobileNumber"
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

        <Form.Item label="Upload Author Data" {...tailLayout}>
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
              loading={isAddingAuthor}
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

export default CreateAuthor;
