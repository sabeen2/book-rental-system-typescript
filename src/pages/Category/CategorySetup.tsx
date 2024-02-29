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

import CreateCategory from "./CreateCategory";

import {
  useFetchCategory,
  useDeleteCategory,
  useFindCategoryById,
  useDownloadCategoryDetails,
} from "../../api/category/queries";

interface CategoryDataType {
  id: string;
  name: string;
  discription: string;
}

const CategorySetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDataType | any
  >(null);
  const [findTheCategory, setFindTheCategory] = useState<
    CategoryDataType | any
  >(null);
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();

  const [searchedCategoryId, setSearchedCategoryId] = useState<
    CategoryDataType | any
  >("");

  const columns: TableProps<CategoryDataType>["columns"] = [
    {
      title: "Category ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => {
        const numA = parseInt(a.id, 10);
        const numB = parseInt(b.id, 10);
        return numA - numB;
      },
      sortDirections: ["descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "discription",
      key: "discription",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditDrawer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this category?"
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

  const showEditDrawer = (category: CategoryDataType) => {
    form.setFieldsValue(category);
    setSelectedCategory(category);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchCategory();
    setSelectedCategory(null);
  };

  const { mutate: deleteThisCategory } = useDeleteCategory();

  const handleDelete = (categoryID: any) => {
    deleteThisCategory(categoryID, {
      onSuccess: (data) => {
        message.success(`Deleted category Successfully ${data}`);
        console.log(data);
        refetchCategory();
      },
    });
  };

  const { mutate: downloadCategory } = useDownloadCategoryDetails();

  const handleDownloadCategoryDetails = () => {
    downloadCategory(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "category_details.xlsx";
        link.click();
      }
    });
  };

 
  const {
    data: categoryData,
    isLoading: isLoadingCategoryData,
    refetch: refetchCategory,
  } = useFetchCategory();

 const handleInputChange = (event: any) => {
    const { value } = event.target;
    if (!value) {
      setFindTheCategory(null);
      setSearchedCategoryId("");
    } 
  };


  const { data: findCategory, isLoading: findCategoryLoading, refetch:refetchFindCategory } =
    useFindCategoryById(searchedCategoryId);

  const searchById = (values: any) => {
    setSearchedCategoryId(values.categoryId);
  };

  useEffect(() => {
    if (searchedCategoryId) {
      setFindTheCategory(findCategory)
      refetchFindCategory(); 
    }
  }, [searchedCategoryId, refetchFindCategory, findCategory]);

  return (
    <div className="flex-grow mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Category Setup</h2>
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
          title={selectedCategory ? "Edit Category" : "Create Category"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateCategory
              selectedCategory={selectedCategory}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      <Button
        className=" mb-4 bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadCategoryDetails}
      >
        Download Category Details
      </Button>
      <Form form={inputForm} onFinish={searchById}>
        <Form.Item name="categoryId">
          <Input
            placeholder="Enter Category ID"
            value={searchedCategoryId ? searchedCategoryId : ""}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded"
            type="default"
            htmlType="submit"
          >
            Find Category
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={findTheCategory ? [findTheCategory] : categoryData}
        loading={findTheCategory ? findCategoryLoading : isLoadingCategoryData}
        rowKey="id"
        pagination={{ pageSize: 7, responsive: true }}
      />
    </div>
  );
};

export default CategorySetup;
