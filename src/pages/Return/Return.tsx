import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useFetchAllTransaction } from "../../api/transaction/queries";
import dayjs from "dayjs";

interface ReturnDataType {
  id: string;
  name: string;
  code: string;
  to_date: string;
  from_date: string;
  member_name: string;
}

const columns: TableProps<ReturnDataType>["columns"] = [
  {
    title: "SN",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },

  {
    title: "From Date",
    dataIndex: "from_date",
    key: "from_date",
    render: (date) => dayjs(date).format("YYYY-MM-DD"),
  },
  {
    title: "To Date",
    dataIndex: "to_date",
    key: "to_date",
    render: (date) => dayjs(date).format("YYYY-MM-DD"),
  },
  {
    title: "Member Name",
    dataIndex: "member_name",
    key: "member_name",
  },
];

const Return: React.FC = () => {
  const { data: returnHistory } = useFetchAllTransaction();

  return (
    <div className="flex-grow mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Return History</h2>
      </div>

      <Table columns={columns} dataSource={returnHistory} />
    </div>
  );
};
export default Return;
