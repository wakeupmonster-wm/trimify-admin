import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Receipt } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getTransactionManagementColumns } from "@/components/columns/transaction.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionsList } from "../store/transaction.slice";
import { useDebounce } from "../../../hooks/useDebounce";

const TransactionManagementPage = () => {
  const dispatch = useDispatch();
  const {
    transactions,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.transactionManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    dispatch(
      // fetchTransactionsList({
      //   page: pagination.pageIndex + 1,
      //   limit: pagination.pageSize,
      //   search: debouncedSearchTerm,
      // })
      fetchTransactionsList(),
    );
    // }, [dispatch, pagination.pageIndex, pagination.pageSize, debouncedSearchTerm]);
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
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 w-full">
            <PageHeader
              heading="All Transactions"
              icon={<Receipt className="w-6 h-6 text-white shrink-0" />}
              variant="primary"
              subheading="View and manage all user transactions and download invoices."
            />
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
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
            searchPlaceholder="Search by email..."
            itemName="entries"
            isLoading={loading}
            manualPagination={!!serverPagination}
            manualFiltering={!!serverPagination}
          />
        </div>
      </div>
    </Container>
  );
};

export default TransactionManagementPage;
