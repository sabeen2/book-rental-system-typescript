import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  message,
  Upload,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  useAddTransaction,
  useUploadTransactionDetails,
  useupdateTransaction,
} from "../../api/transaction/queries";
import { useFetchMember } from "../../api/members/queries";
import { useFetchBook } from "../../api/book/queries";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface TransactionDataType {
  id: any;
  bookName: string;
  bookId: any;
  code: any;
  fromDate: any;
  toDate: any;
  rentType: any;
  memberName:any;
  Fk_member_id: any;
}

interface CreateTransactionProps {
  setSelectedTransaction?: TransactionDataType | null | undefined;
  selectedTransaction?: TransactionDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateTransaction: React.FC<CreateTransactionProps> = ({
  selectedTransaction,
  form,
  onSucess,
}) => {
  const { mutate: addTransaction, isLoading: isAddingTransaction } =
    useAddTransaction();
  const { mutate: editTransaction } = useupdateTransaction();

  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = (values: any) => {
    console.log(values)
    let payload: any = {
      bookId: values.bookId,
      code: values.code,
      fromDate: values.fromDate,
      toDate: values.toDate,
      rentType: values.rentType,
      Fk_member_id: values.Fk_member_id,
    };
    if (selectedTransaction) {
    
      payload = { ...payload, id: selectedTransaction.id, bookName:selectedTransaction.bookId, memberName:selectedTransaction.Fk_member_id };
      console.log(selectedTransaction.bookName)
    }
    selectedTransaction
      ? editTransaction(payload, {
          onSuccess: () => {
            message.success(`Edited transaction Sucessfully:  ${values.name}`);
            onSucess();
          },
        })
      : addTransaction(payload, {
          onSuccess: () => {
            message.success(`Added transaction Sucessfully:  ${values.name}`);
            onSucess();
          },
          onError:(errorMessage:any)=>{
            message.error(`Failed : ${errorMessage}`)
          }
        });
  };

  const onReset = () => {
    form.resetFields();
  };

  const { mutate: uploadTransaction } = useUploadTransactionDetails();

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
    uploadTransaction(
      { file },
      {
        onSuccess: () => {
          setFileList([]);
          onSucess();
          message.success("Uploaded Sucessfully");
        },
        onError: () => {
          message.error(`Error Uploading `);
        },
      }
    );
  };

  useEffect(() => {
    if (selectedTransaction) {
      form.setFieldsValue({
        id: selectedTransaction.id,
        bookName: selectedTransaction.bookName,
        code: selectedTransaction.code,
        fromDate: selectedTransaction.fromDate,
        toDate: selectedTransaction.toDate,
        rentType: selectedTransaction.rentType,
        memberName: selectedTransaction.memberName,
      });
    }
  }, [selectedTransaction, form]);

  const {
    data: bookData,
  } = useFetchBook();

  const {
    data: memberData,
  } = useFetchMember();






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
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please enter the code" }]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Book"
          name="bookId"
          rules={[{ required: true, message: "Please select a book" }]}
        >
        <Select
            className="w-full"
            
            placeholder="Select Book"
            options={bookData?.map(
              (book: { id: any; name: any }) => ({
                value: parseInt(book.id),
                label: book.name,
              })
            )}
          />
        </Form.Item>

        <Form.Item
          label="From Date"
          name="fromDate"
          rules={[{ required: true, message: "Please select from date" }]}
        >
          <Input
            type="date"
            className="w-full py-2 px-4 border border-gray-900 rounded"
          />
        </Form.Item>

        <Form.Item
          label="To Date"
          name="toDate"
          rules={[{ required: true, message: "Please select to date" }]}
        >
          <Input
            type="date"
            className="w-full py-2 px-4 border border-gray-900 rounded"
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="rentType"
          rules={[{ required: true, message: "Plese Select Status" }]}
        >
          <Select options={[{ value: 'RENT', label: <span>Rent</span> },{ value: 'RETURN', label: <span>Return</span> }]} />
        </Form.Item>

        <Form.Item
          label="Member"
          name= "Fk_member_id"
          rules={[{ required: true, message: "Please select a member" }]}
        >
          <Select
            className="w-full"
            placeholder="Select Member"
            options={memberData?.map(
              (member: { memberid: any; name: any }) => ({
                value: parseInt(member.memberid),
                label: member.name,
              })
            )}
          />
        </Form.Item>

        <Form.Item label="Upload Transaction Data" {...tailLayout}>
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
              loading={isAddingTransaction}
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

export default CreateTransaction;
