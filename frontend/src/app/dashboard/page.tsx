"use client";
import { ProtectedRoute } from "@/contexts/sessionContext";
import Breadcrumb from "../../components/shared/Breadcrumb";
import { BreadcrumbData } from "../../components/shared/Breadcrumb";
import ContentCard from "../../components/shared/ContentCard";
import { useEffect, useState } from "react";
import { getAllPatients, getAllTransactions, getAllBranches, getAllUsers } from "@/client/client";
import { IPatient, ITransaction, IBranch, IUser } from "@/app/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Users, Building2, CreditCard, TrendingUp, UserCheck, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const breadcrumbData: BreadcrumbData[] = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Dashboard",
      url: "/dashboard",
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [patientsRes, transactionsRes, branchesRes, usersRes] = await Promise.all([
        getAllPatients(),
        getAllTransactions(),
        getAllBranches(),
        getAllUsers(),
      ]);

      setPatients(patientsRes.patients || patientsRes || []);
      setTransactions(transactionsRes.transactions || transactionsRes || []);
      setBranches(branchesRes.branches || branchesRes || []);
      setUsers(usersRes.users || usersRes || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.transactionAmount, 0);

  // Get new patients (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newPatients = patients.filter((p) => new Date(p.patientDOB) > thirtyDaysAgo).length;

  // Get monthly revenue (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = transactions
    .filter((t) => {
      const tDate = new Date(t.transactionDate);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.transactionAmount, 0);

  const totalDoctors = users.filter((u) => u.role === "DOCTOR").length;

  // Recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(1)}K`;
  } else {
    return `Rp ${amount}`;
  }
};

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPatientName = (transaction: ITransaction): string => {
    if (typeof transaction.patientId === "string") {
      return transaction.patientId;
    }
    return transaction.patientId.patientFullName;
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
          <Breadcrumb data={breadcrumbData} />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />
        <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Overview</h1>
        <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
          View important metrics for your dental clinic here.
        </p>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-7">
          {/* Total Patients */}
          <Link className="block h-full" href="/dashboard/patients">
            <ContentCard className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-2">
                    Total Patients
                  </p>
                  <h1 className="text-[36px] font-bold text-green-dark dark:text-white">{patients.length}</h1>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="size-5 text-blue-500" />
                </div>
              </div>
            </ContentCard>
          </Link>

          {/* Monthly Revenue */}
          <Link className="block h-full" href="/dashboard/transactions">
            <ContentCard className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-2">
                    Monthly Revenue
                  </p>
                  <h1 className="text-[28px] font-bold text-green-dark dark:text-white">
                    {formatCurrencyShort(monthlyRevenue)}
                  </h1>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="size-5 text-green-500" />
                </div>
              </div>
            </ContentCard>
          </Link>

          {/* Total Branches */}
          <Link className="block h-full" href="/dashboard/branches">
            <ContentCard className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-2">Branches</p>
                  <h1 className="text-[36px] font-bold text-green-dark dark:text-white">{branches.length}</h1>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Building2 className="size-5 text-purple-500" />
                </div>
              </div>
            </ContentCard>
          </Link>

          {/* Total Doctors */}
          <Link className="block h-full" href="/dashboard/users">
            <ContentCard className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-2">Doctors</p>
                  <h1 className="text-[36px] font-bold text-green-dark dark:text-white">{totalDoctors}</h1>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Stethoscope className="size-5 text-orange-500" />
                </div>
              </div>
            </ContentCard>
          </Link>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Revenue */}
          <ContentCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-2">
                  Total Revenue (All Time)
                </p>
                <h1 className="text-[32px] font-bold text-green-dark dark:text-white">
                  {formatCurrency(totalRevenue)}
                </h1>
                <p className="text-sm text-grey-dark dark:text-grey-gc mt-2">From {transactions.length} transactions</p>
              </div>
              <CreditCard className="w-12 h-12 text-green-dark dark:text-white opacity-20" />
            </div>
          </ContentCard>

          {/* New Patients */}
          <ContentCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-2">
                  New Patients (30 Days)
                </p>
                <h1 className="text-[32px] font-bold text-green-dark dark:text-white">{newPatients}</h1>
                <p className="text-sm text-grey-dark dark:text-grey-gc mt-2">Registered in last month</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-dark dark:text-white opacity-20" />
            </div>
          </ContentCard>
        </div>

        {/* Recent Transactions */}
        <ContentCard>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[24px] font-semibold text-green-dark dark:text-white">Recent Transactions</h1>
              <p className="font-semibold text-grey-dark dark:text-grey-gc">Latest transactions from your clinic.</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/transactions")}
              className="px-4 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              View All
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <p className="text-grey-dark dark:text-grey-gc text-center py-8 italic">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-grey-light dark:border-grey-dark">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-grey-dark dark:text-white">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-grey-dark dark:text-white">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-grey-dark dark:text-white">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-grey-dark dark:text-white">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-light dark:divide-grey-dark">
                  {recentTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-light-primary dark:hover:bg-dark-primary transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/transactions/${transaction._id}`)}
                    >
                      <td className="px-4 py-3 text-sm text-grey-dark dark:text-grey-gc">
                        {formatDate(transaction.transactionDate)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-dark dark:text-white">
                        {getPatientName(transaction)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-dark dark:text-white">
                        {formatCurrency(transaction.transactionAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-semibold">
                          {transaction.paymentMethod}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ContentCard>
      </main>
    </ProtectedRoute>
  );
}

