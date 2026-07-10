import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "@/components/common/container";
import TransactionDetails from "../components/transaction.details";

export default function TransactionDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;

  const handleBack = () => {
    navigate(-1);
  };

  if (!transaction) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-sm font-semibold text-slate-500">
            Transaction data not found. Please go back and try again.
          </p>
          <button
            onClick={handleBack}
            className="text-sm font-bold text-brand-aqua hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <TransactionDetails transaction={transaction} onBack={handleBack} />
    </Container>
  );
}
