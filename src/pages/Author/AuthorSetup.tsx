import React, { useEffect, useState } from "react"
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

import CreateAuthor from "./CreateAuthor";

import {
  useFetchAuthor,
  useDeleteAuthor,
  useFindAuthorById,
  useDownloadAuthorDetails,
} from "../../api/author/queries";

interface AuthorDataType {
  authorId: string;
  name: string;
  email: string;
  mobileNumber: string;
}

const AuthorSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<
    AuthorDataType | any
  >(null);
  const [findTheAuthor, setFindTheAuthor] = useState<
    AuthorDataType | any
  >(null);
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();

  const [searchedAuthorId, setSearchedAuthorId] = useState<
    AuthorDataType | any
  >("");

  const columns: TableProps<AuthorDataType>["columns"] = [
    
    {
      title: "Author ID",
      dataIndex: "authorId",
      key: "authorId",
      sorter: (a, b) => {
        const numA = parseInt(a.authorId, 10);
        const numB = parseInt(b.authorId, 10);
        return numA - numB;
      },
      sortDirections: ["descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
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
            title="Are you sure you want to delete this author?"
            onConfirm={() => handleDelete(record.authorId)}
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

  const showEditDrawer = (author: AuthorDataType) => {
    form.setFieldsValue(author);
    setSelectedAuthor(author);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchAuthor();
    setSelectedAuthor(null);
  };

  const { mutate: deleteThisAuthor } = useDeleteAuthor();

  const handleDelete = (authorID: any) => {
    deleteThisAuthor(authorID, {
      onSuccess: (data) => {
        message.success(`Deleted author Successfully ${data}`);
        setFindTheAuthor(null)
        refetchAuthor();
      },
    });
  };





  const handleDownloadAuthorDetails = () => {
    downloadAuthors(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "author_details.xlsx";
        link.click();
      }
    });
  };
  

 
  const {
    data: authorData,
    isLoading: isLoadingAuthorData,
    refetch: refetchAuthor,
  } = useFetchAuthor();

  const { mutate: downloadAuthors } = useDownloadAuthorDetails();

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    if (!value) {
      setFindTheAuthor(null);
      setSearchedAuthorId('')
     
    }
  };

  
  const { data: findAuthor, isLoading: findAuthorLoading, refetch:refetchFindAuthor } =
    useFindAuthorById(searchedAuthorId);

  const searchById = (values: any) => {
    setSearchedAuthorId(values.authorId);
  };

  useEffect(() => {
    if (searchedAuthorId) {
      setFindTheAuthor(findAuthor)
      refetchFindAuthor(); 
    }
  }, [searchedAuthorId, refetchFindAuthor, findAuthor]);


  return (
    <div className="flex-grow mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Author Setup</h2>
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
          title={selectedAuthor ? "Edit Author" : "Create Author"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateAuthor
              selectedAuthor={selectedAuthor}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      <Button
        className=" mb-4 bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadAuthorDetails}
      >
        Download Author Details
      </Button>
      <Form form={inputForm} onFinish={searchById}>
        <Form.Item name="authorId">
          <Input
            placeholder="Enter Author ID"
            value={searchedAuthorId ? searchedAuthorId : ""}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded"
            type="default"
            htmlType="submit"
          >
            Find Author
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={findTheAuthor ? [findTheAuthor] : authorData}
        loading={findTheAuthor ? findAuthorLoading : isLoadingAuthorData}
        rowKey="authorId"
        pagination={{ pageSize: 7, responsive: true }}
      />
    </div>
  );
};

export default AuthorSetup;
