import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  message,
  Popconfirm,
  Form,
  Input,
} from "antd";
import type { TableProps } from "antd";

import RentForm from "./RentForm";

import {
  useFetchTransaction,
  useDeleteTransaction,
  useFindTransactionById,
  // useDownloadTransactionDetails,
  useMailDueTransaction,
} from "../../api/transaction/queries";

interface TransactionDataType {
  id: any;
  bookName: string;
  code: any;
  fromDate:any;
  toDate:any;
  rentType:any;
  memberName:any

}

const TransactionSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionDataType | any
  >(null);
  const [findTheTransaction, setFindTheTransaction] = useState<
    TransactionDataType | any
  >(null);
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();

  const [searchedTransactionId, setSearchedTransactionId] = useState<
    TransactionDataType | any
  >("");

  const columns: TableProps<TransactionDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Book Name",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "From",
      dataIndex: "fromDate",
      key: "fromDate",
    },
    {
      title: "To",
      dataIndex: "toDate",
      key: "toDate",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Rent Status",
      dataIndex: "rentType",
      key: "rentType",
    },
    {
      title: "Member",
      dataIndex: "memberName",
      key: "memberName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" onClick={() => showEditDrawer(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this transaction?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const showEditDrawer = (transaction: TransactionDataType) => {
    form.setFieldsValue(transaction);
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchTransaction();
    setSelectedTransaction(null);
  };

  const { mutate: deleteThisTransaction } = useDeleteTransaction();

  const handleDelete = (transactionID: any) => {
    deleteThisTransaction(transactionID, {
      onSuccess: (data) => {
        message.success(`Deleted transaction Successfully ${data}`);
        setFindTheTransaction(null)
        refetchTransaction();
      },
    });
  };

 
  const {
    data: transactionData,
    isLoading: isLoadingTransactionData,
    refetch: refetchTransaction,
  } = useFetchTransaction();

  // const handleDownloadTransactionDetails = () => {
//   downloadTransactions(undefined, {
//     onSuccess: (data: BlobPart) => {
//       const blob = new Blob([data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = "transaction_details.xlsx";
//       link.click();
//     }
//   });

// const { refetch, data: downloadTransactions, isLoading, isError } = useDownloadTransactionDetails();



const handleDownloadTransactionDetails = async () => {
  console.log('ll')
  };


  const handleInputChange = (event: any) => {
    const { value } = event.target;
    if (!value) {
      setFindTheTransaction(null);
      setSearchedTransactionId("");
    }
  };


  const { data: findTransaction, isLoading: findTransactionLoading, refetch:refetchFindTransaction } =
    useFindTransactionById(searchedTransactionId);

  const searchById = (values: any) => {
    setSearchedTransactionId(values.transactionId);
  };

  useEffect(() => {
    if (searchedTransactionId) {
      setFindTheTransaction(findTransaction)
      refetchFindTransaction(); 
    }
  }, [searchedTransactionId, refetchFindTransaction, findTransaction]);






  const {mutate:sendMail} = useMailDueTransaction()


  const handleSendMail =() => {
    sendMail(undefined,{
      onSuccess:()=>{
        message.success("Due emails send sucessfully")
      }, 
      onError:(data) =>{
        message.error(`Failed: ${data}`)
      }
    })
  }

  return (
    <div className="flex-grow mx-10 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transaction Setup</h2>
        <Button
          className="bg-white text-black font-bold py-1 px-4 rounded-full transform hover:scale-105 hover:shadow-md"
          type="default"
          onClick={showDrawer}
        >
          Create
        </Button>
        <Drawer
          className="flex"
          width={800}
          autoFocus
          title={selectedTransaction ? "Edit Transaction" : "Create Transaction"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <RentForm
              selectedTransaction={selectedTransaction}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      <Button
        className=" mb-4 bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadTransactionDetails}
      >
        Download Transaction Details
      </Button>
      <Button
        className=" mb-4 bg-blue-800 hover:bg-green-700 text-white font-bold px-2 ml-6 rounded-full"
        type="default"
        onClick={handleSendMail}
      >
        Send Due Mail
      </Button>
      <Form form={inputForm} onFinish={searchById}>
        <Form.Item name="transactionId">
          <Input
            placeholder="Enter Transaction ID"
            value={searchedTransactionId ? searchedTransactionId : ""}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded "
            type="default"
            htmlType="submit"
          >
            Find Transaction
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={findTheTransaction ? [findTheTransaction] : transactionData}
        loading={findTheTransaction ? findTransactionLoading : isLoadingTransactionData}
        rowKey="transactionId"
        pagination={{ pageSize: 7, responsive: true }}
      />
    </div>
  );
};

export default TransactionSetup;
