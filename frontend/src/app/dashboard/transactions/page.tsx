"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/shared/Breadcrumb";
import NewTransaction from "@/components/dashboard/NewTransaction";
import { ITransaction, IBranch } from "@/app/types";
import { getAllTransactions, getTransactionsByBranch, getAllBranches } from "@/client/client";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/contexts/sessionContext";

export default function TransactionsPage() {
  const router = useRouter();
  const [openNewTransactionModal, setOpenNewTransactionModal] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const breadcrumbData = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Transactions",
      url: "/dashboard/transactions",
    },
  ];

  useEffect(() => {
    fetchBranches();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchId]);

  const fetchBranches = async () => {
    try {
      const response = await getAllBranches();
      setBranches(response.branches || response);
    } catch (error) {
      toast.error("Failed to load branches" + (error instanceof Error ? `: ${error.message}` : ""));
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      let response;
      if (selectedBranchId) {
        response = await getTransactionsByBranch(selectedBranchId);
      } else {
        response = await getAllTransactions();
      }
      setTransactions(response.transactions || response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPatientName = (transaction: ITransaction): string => {
    if (typeof transaction.patientId === "string") {
      return transaction.patientId;
    }
    return transaction.patientId.patientFullName;
  };

  const getDoctorName = (transaction: ITransaction): string => {
    if (typeof transaction.assessmentBy === "string") {
      return transaction.assessmentBy;
    }
    return transaction.assessmentBy.username;
  };

  const getBranchName = (transaction: ITransaction): string => {
    if (typeof transaction.branchId === "string") {
      return transaction.branchId;
    }
    return transaction.branchId.branchName;
  };

  const getPaymentMethodBadge = (method: string): string => {
    switch (method) {
      case "CASH":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "CARD":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "QRIS":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400";
      default:
        return "bg-grey-500/20 text-grey-600 dark:text-grey-400";
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.transactionAmount, 0);

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Transaction Management</h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
              Record and manage clinic transactions here.
            </p>
          </div>
          <NewTransaction
            modalState={openNewTransactionModal}
            setModalState={setOpenNewTransactionModal}
            onTransactionCreated={fetchTransactions}
          />
        </div>

        {/* Branch Filter */}
        <div className="mt-6 bg-white dark:bg-dark-secondary rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-grey-dark dark:text-white uppercase">Filter by Branch:</label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-3 py-2 rounded-md bg-transparent text-green-dark dark:text-white min-w-[250px]"
            >
              <option
                value=""
                className="bg-dark-secondary"
              >
                All Branches
              </option>
              {branches.map((branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                  className="bg-dark-secondary"
                >
                  {branch.branchName} - {branch.branchLocation}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
            <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">Total Transactions</p>
            <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">{transactions.length}</p>
          </div>
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
            <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">Total Revenue</p>
            <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
            <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">Average Transaction</p>
            <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">
              {transactions.length > 0 ? formatCurrency(totalAmount / transactions.length) : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-6 bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20 text-grey-dark dark:text-grey-gc">
              <p className="text-xl">No transactions found</p>
              <p className="mt-2">
                {selectedBranchId ? "No transactions found for this branch" : "Create a new transaction to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-primary dark:bg-dark-primary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">Branch</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-light dark:divide-grey-dark">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                        {formatDate(transaction.transactionDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-dark dark:text-white">
                        {getPatientName(transaction)}
                      </td>
                      <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                        {getDoctorName(transaction)}
                      </td>
                      <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                        {getBranchName(transaction)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-dark dark:text-white">
                        {formatCurrency(transaction.transactionAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentMethodBadge(
                            transaction.paymentMethod
                          )}`}
                        >
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => router.push(`/dashboard/transactions/${transaction._id}`)}
                          className="text-green-dark dark:text-white hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction count */}
        {!isLoading && transactions.length > 0 && (
          <div className="mt-4 text-sm text-grey-dark dark:text-grey-gc">
            Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
            {selectedBranchId && ` for ${branches.find((b) => b._id === selectedBranchId)?.branchName}`}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
