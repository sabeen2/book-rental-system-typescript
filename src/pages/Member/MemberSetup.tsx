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

import CreateMember from "./CreateMember";
import {
  useFetchMember,
  useDeleteMember,
  useFindMemberById,
  useDownloadMemberDetails,
} from "../../api/members/queries";

interface MemberDataType {
  memberid: string;
  name: string;
  email: string;
  mobileNo: string;
  address:string;
}

const MemberSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    MemberDataType | any
  >(null);
  const [findTheMember, setFindTheMember] = useState<
    MemberDataType | any
  >(null);
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();

  const [searchedMemberId, setSearchedMemberId] = useState<
    MemberDataType | any
  >("");

  const columns: TableProps<MemberDataType>["columns"] = [
    {
      title: "Member ID",
      dataIndex: "memberid",
      key: "memberid",
      sorter: (a, b) => {
        const numA = parseInt(a.memberid, 10);
        const numB = parseInt(b.memberid, 10);
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
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditDrawer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this member?"
            onConfirm={() => handleDelete(record.memberid)}
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

  const showEditDrawer = (member: MemberDataType) => {
    form.setFieldsValue(member);
    setSelectedMember(member);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchMember();
    setSelectedMember(null);
  };

  const { mutate: deleteThisMember } = useDeleteMember();

  const handleDelete = (memberID: any) => {
    deleteThisMember(memberID, {
      onSuccess: () => {
        message.success(`Deleted member Successfully `);
        refetchMember();
      },
    });
  };

  const { mutate: downloadMembers } = useDownloadMemberDetails();

  const handleDownloadMemberDetails = () => {
    downloadMembers(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "member_details.xlsx";
        link.click();
      }
    });
  };

  const {
    data: memberData,
    isLoading: isLoadingMemberData,
    refetch: refetchMember,
  } = useFetchMember();

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    if (!value) {
      setFindTheMember(null);
      setSearchedMemberId("");
    }
  };


  const { data: findMember, isLoading: findMemberLoading, refetch:refetchFindMember } =
    useFindMemberById(searchedMemberId);

  const searchById = (values: any) => {
    setSearchedMemberId(values.memberid);
  };

  useEffect(() => {
    if (searchedMemberId) {
      setFindTheMember(findMember)
      refetchFindMember(); 
    }
  }, [searchedMemberId, refetchFindMember, findMember]);






  return (
    <div className="flex-grow mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Member Setup</h2>
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
          title={selectedMember ? "Edit Member" : "Create Member"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateMember
              selectedMember={selectedMember}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      <Button
        className=" mb-4 bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadMemberDetails}
      >
        Download Member Details
      </Button>
      <Form form={inputForm} onFinish={searchById}>
        <Form.Item name="memberid">
          <Input
            placeholder="Enter Member ID"
            value={searchedMemberId ? searchedMemberId : ""}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded"
            type="default"
            htmlType="submit"
          >
            Find Member
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={findTheMember ? [findTheMember] : memberData}
        loading={findTheMember ? findMemberLoading : isLoadingMemberData}
        rowKey="memberid"
        pagination={{ pageSize: 7, responsive: true }}
      />
    </div>
  );
};

export default MemberSetup;
