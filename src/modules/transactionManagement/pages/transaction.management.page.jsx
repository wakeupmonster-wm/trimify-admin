import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Receipt } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getTransactionManagementColumns } from "@/components/columns/transaction.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionsList } from "../store/transaction.slice";

const TransactionManagementPage = () => {
  const dispatch = useDispatch();
  const {
    transactions,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.transactionManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    dispatch(
      // fetchTransactionsList({
      //   page: pagination.pageIndex + 1,
      //   limit: pagination.pageSize,
      //   search: globalFilter,
      // })
      fetchTransactionsList(),
    );
    // }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);
  }, [dispatch]);

  const displayData = transactions || [];

  const handleAction = (row, action) => {
    if (action === "download-invoice") {
      console.log("Download invoice for:", row.transactionId);
    }
  };

  const columns = useMemo(
    () => getTransactionManagementColumns(handleAction),
    [],
  );

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
          rowCount={
            serverPagination ? serverPagination.total : displayData.length
          }
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search transactions..."
          itemName="entries"
          isLoading={loading}
          manualPagination={!!serverPagination}
          manualFiltering={!!serverPagination}
        />
      </div>
    </Container>
  );
};

export default TransactionManagementPage;
