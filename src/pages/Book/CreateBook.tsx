import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { useAddBook, useupdateBook } from "../../api/book/queries";
import { useFetchAuthor } from "../../api/author/queries";
import { useFetchCategory } from "../../api/category/queries";
import dayjs from "dayjs";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface BookDataType {
  id: string;
  name: string;
  rating: any;
  stock: any;
  publishedDate: any;
  file: any;
  isbn: any;
  pages: any;
  categoryId: any;
  authorId: any;
  photo:any;
}

interface CreateBookProps {
  selectedBook?: BookDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateBook: React.FC<CreateBookProps> = ({
  selectedBook,
  form,
  onSucess,
}) => {
  const { mutate: addBook, isLoading: isAddingBook } = useAddBook();

  
  const onFinish = (values: any) => {
   
    console.log(values)
    let payload: any = {
      name: values.name,
      rating: values.rating,
      stock: values.stock,
      publishedDate: dayjs(values.publishedDate, 'YYYY/MM/DD'),
      file: values.file.file,
      isbn: values.isbn,
      pages: values.pages,
      categoryId: values.categoryId,
      authorId: values.authorId,
      photo: values.photo,
    };

    if (selectedBook) {
      console.log(payload);
      payload = { ...payload, id: selectedBook.id };
      console.log(payload);
    }
    selectedBook
      ? editBook(payload, {
          onSuccess: () => {
            message.success(`Edited book Sucessfully:  ${values.name}`);
            onSucess();
          },
          onError:(errorMessage)=> { message.error(`Failed Editing ${errorMessage}`)}
        })
      : addBook(payload, {
          onSuccess: () => {
            message.success(`Added book Sucessfully:  ${values.name}`);
            onSucess();
          },
          onError:(data)=> { message.error(`Failed Creating: ${data}`)}
          
        });
  };

  const onReset = () => {
    form.resetFields();
  };

  const { mutate: editBook } = useupdateBook();

  useEffect(() => {
    if (selectedBook) {
      form.setFieldsValue({

        id:selectedBook.id,
      name: selectedBook.name,
      rating: selectedBook.rating,
      stock: selectedBook.stock,
       publishedDate: dayjs(selectedBook.publishedDate, 'YYYY/MM/DD'),
      // file: selectedBook.file.file,
      isbn: selectedBook.isbn,
      pages: selectedBook.pages,
      categoryId: selectedBook.categoryId,
      authorId: selectedBook.authorId,
      photo: selectedBook.photo,
      });
    }
  }, [selectedBook, form]);

  const { data: categoryData } = useFetchCategory();

  const { data: authorData } = useFetchAuthor();

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
          label="ISBN"
          name="isbn"
          rules={[{ required: true, message: "Please enter the ISBN" }]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select the category" }]}
        >
          <Select
            className="w-full"
            placeholder="Select category"
            dropdownStyle={{ border: "1px solid black" }}
            options={categoryData?.map((category: { id: any; name: any }) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Author"
          name="authorId"
          rules={[
            { required: true, message: "Please select at least one author" },
          ]}
        >
          <Select
            className="w-full"
            mode="multiple"
            placeholder="Select authors"
            options={authorData?.map(
              (author: { authorId: any; name: any }) => ({
                value: author.authorId,
                label: author.name,
              })
            )}
          />
        </Form.Item>

        <Form.Item
          label="Pages"
          name="pages"
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter the number of pages",
            },
          ]}
        >
          <InputNumber className="w-full  border-gray-900" />
        </Form.Item>

        <Form.Item
          label="Rating"
          name="rating"
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter the rating",
            },
          ]}
        >
          <InputNumber className="w-full  border-gray-900" />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: true,
              type: "number",
              message: "Please enter the stock quantity",
            },
          ]}
        >
          <InputNumber className=" border-gray-900 w-full" />
        </Form.Item>
        

        <Form.Item
          label="Published Date"
          name="publishedDate"
          rules={[
            { required: true, message: "Please select the published date" },
          ]}
        >
          <DatePicker className="  border-gray-900 w-full" />
        </Form.Item>

        <Form.Item
          label="Photo Name"
          name="photo"
          rules={[{ required: true, message: "Please enter the photo name" }]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Photo"
          name="file"
          rules={[{ required: true, message: "Please upload the photo" }]}
        >
          <Upload name="file" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400  text-white font-bold px-4  rounded-full"
              type="default"
              htmlType="submit"
              loading={isAddingBook}
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

export default CreateBook;
