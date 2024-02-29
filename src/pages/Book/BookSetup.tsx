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

import CreateBook from "./CreateBook";
import {
  useFetchBook,
  useDeleteBook,
  useFindBookById,
  useFindBookImageById,
} from "../../api/book/queries";
import dayjs from "dayjs";


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
  authorName: any; 
}

const BookSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<
    BookDataType | any
  >(null);
  const [findTheBook, setFindTheBook] = useState<
    BookDataType | any
  >(null);
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();

  const [searchedBookId, setSearchedBookId] = useState<
    BookDataType | any
  >("");

  const [searchedImageId, setSearchedImageId] = useState<
    BookDataType | any
  >("");

  const columns: TableProps<BookDataType>["columns"] = [
    {
      title: "Book ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10),
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
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Pages", 
      dataIndex: "pages",
      key: "pages",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        if (stock === 0) {
          return <span>Out of Stock</span>;
        } else {
          return <span>{stock} </span>;
        }
      },
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <Button onClick={() => handleGetImage(record.id)}>Get Image</Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditDrawer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this book?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            okButtonProps={{ danger: true }}
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const { refetch: refetchImage} = useFindBookImageById(searchedImageId)

  const handleGetImage = (bookID: string) => {
    setSearchedImageId(bookID);
    console.log(searchedImageId)
  };


  useEffect (()=> {
    if (searchedImageId) {
      refetchImage(); 
    }
  },[searchedImageId])

  const showEditDrawer = (book: BookDataType) => {
    form.setFieldsValue({...book,publishedDate:dayjs(book.publishedDate, 'YYYY/MM/DD') });
    setSelectedBook(book);
    setOpen(true);
    console.log(book)
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchBook();
    setSelectedBook(null);
  };

  const { mutate: deleteThisBook } = useDeleteBook();

  const handleDelete = (bookID: any) => {
    deleteThisBook(bookID, {
      onSuccess: () => {
        message.success(`Deleted book Successfully `);
        refetchBook();
      },
    });
  };

  const {
    data: bookData,
    isLoading: isLoadingBookData,
    refetch: refetchBook,
  } = useFetchBook();

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    if (!value) {
      setFindTheBook(null);
      setSearchedBookId("");
    }
  };


  const { data: findBook, isLoading: findBookLoading, refetch:refetchFindBook } =
    useFindBookById(searchedBookId);

  const searchById = (values: any) => {
    setSearchedBookId(values.id);
  };

  useEffect(() => {
    if (searchedBookId) {
      setFindTheBook(findBook)
      refetchFindBook(); 
    }
  }, [searchedBookId, refetchFindBook, findBook]);



  return (
    <div className="flex-grow mx-10 mt-10 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Book Setup</h2>
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
          title={selectedBook ? "Edit Book" : "Create Book"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateBook
              selectedBook={selectedBook}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      
      <Form form={inputForm} onFinish={searchById}>
        <Form.Item name="id">
          <Input
            placeholder="Enter Book ID"
            value={searchedBookId ? searchedBookId : ""}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded"
            type="default"
            htmlType="submit"
          >
            Find Book
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={findTheBook ? [findTheBook] : bookData}
        loading={findTheBook ? findBookLoading : isLoadingBookData}
        rowKey="bookid"
        pagination={{ pageSize: 7, responsive: true }}
      />
    </div>
  );
};

export default BookSetup;
