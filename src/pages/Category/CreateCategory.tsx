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


import { useAddCategory, useUploadCategoryDetails, useupdateCategory } from "../../api/category/queries";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface CategoryDataType {
  id: any;
  name: string;
  discription: string;
}

interface CreateCategoryProps {
  selectedCategory?: CategoryDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  selectedCategory,
  form,
  onSucess,
}) => {
  const { mutate: addCategory, isLoading: isAddingCategory } = useAddCategory();

  const onFinish = (values: any) => {
    let payload:any = {
      name: values.name,
      discription: values.discription,
    }
    if(selectedCategory) {
      payload = {...payload, id :selectedCategory.id}
    }
    selectedCategory
      ? editCategory(payload,{
        onSuccess: () => {
          message.success(`Edited category Sucessfully:  ${values.name}`);
          onSucess();
        },
      })
      : addCategory(
          payload,
          {
            onSuccess: () => {
              message.success(`Added category Sucessfully:  ${values.name}`);
              onSucess();
            },
          }
        );
  };

  
  const onReset = () => {
    form.resetFields();
  };

  const [fileList, setFileList] = useState<any[]>([]);
  const { mutate: uploadCategory } = useUploadCategoryDetails();


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
    uploadCategory({ file }, {
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

  const { mutate: editCategory } = useupdateCategory();

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        name: selectedCategory.name,
        discription: selectedCategory.discription,
      });
    }
  }, [selectedCategory, form]);

  

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
          label="Description"
          name="discription"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea
            className="w-full py-2 px-4 border border-gray-900 rounded"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item label="Upload Category Data" {...tailLayout}>
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
              loading={isAddingCategory}
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

export default CreateCategory;
