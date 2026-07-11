import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Receipt } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getTransactionManagementColumns } from "@/components/columns/transaction.management.columns";

const dummyTransactions = [
  {
    id: 1,
    transactionId: "unique_txn_1",
    amountPaid: "99.99",
    subscriptionPlan: "Premium",
    userName: "rajeev patel patell patel",
    createdAt: "30 Jun 2026, 06:13 pm",
    status: "Success",
  },
  {
    id: 2,
    transactionId: "pi_3if8eupi30hiooyg78gp0f9pty480p1iokZ1y6ynUniytyuiuoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "Pragyaa Sonii",
    createdAt: "1 Sept 2025, 11:25 am",
    status: "Success",
  },
  {
    id: 3,
    transactionId: "pi_3if8eupi30hiooyg78gp0f9pty480p1iokZ1y6ynUniytyukuiuuoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "1 Sept 2025, 11:00 am",
    status: "Success",
  },
  {
    id: 4,
    transactionId: "pi_3if8eupi30hiooyg78gp0f9pty480p1iokZ1y6ynUniytykuiuuuoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "26 Aug 2025, 04:30 pm",
    status: "Success",
  },
  {
    id: 5,
    transactionId: "pi_3if8eupi30hiooyg78gp0f9pty480p1iokZ1y6ynUniytykyoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "26 Aug 2025, 12:13 pm",
    status: "Success",
  },
  {
    id: 6,
    transactionId: "pi_3if8eupi30hiooyg78gp0f9opty480p1iokZ1y6ynUniytykyoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "25 Aug 2025, 06:46 pm",
    status: "Success",
  },
  {
    id: 7,
    transactionId: "pi_3lif8eupi30hiooyg78gp0f9opty480p1iokoz1y6ynUnlytyeukyoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "25 Aug 2025, 06:46 pm",
    status: "Success",
  },
  {
    id: 8,
    transactionId:
      "pi_3lif8eupi30hiooyg78gp0f9opMpty480p1iokoZ1y6ynUnlyptyeukyoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "25 Aug 2025, 10:48 am",
    status: "Success",
  },
  {
    id: 9,
    transactionId:
      "pi_3lif8eupi30hiooyg78gp0f9opMpty480p1lokoZ1y6ynUnlyptguyukyopoo",
    amountPaid: "20.00",
    subscriptionPlan: "Premium",
    userName: "",
    createdAt: "25 Aug 2025, 10:44 am",
    status: "Success",
  },
  {
    id: 10,
    transactionId: "pi_3Ry5TCLRmOOQWAGogYV2pKb",
    amountPaid: "10.00",
    subscriptionPlan: "Basic",
    userName: "",
    createdAt: "20 Aug 2025, 11:56 am",
    status: "Success",
  },
];

const TransactionManagementPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Fallback to dummy data
  const displayData = dummyTransactions;

  const handleAction = (row, action) => {
    if (action === "download-invoice") {
      console.log("Download invoice for:", row.transactionId);
    }
  };

  const columns = useMemo(() => getTransactionManagementColumns(handleAction), []);

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <div className="flex-1 min-w-0">
            <PageHeader
              heading="All Transactions"
              icon={<Receipt className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-md"
              subheading="View and manage all user transactions and download invoices."
            />
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={displayData}
          rowCount={displayData.length}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search transactions..."
          itemName="entries"
        />
      </div>
    </Container>
  );
};

export default TransactionManagementPage;
