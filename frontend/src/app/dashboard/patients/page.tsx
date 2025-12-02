"use client";

import { deletePatientById, getAllPatients } from "@/client/client";
import NewPatient from "@/components/dashboard/NewPatient";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { IPatient } from "@/app/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ContentCard from "@/components/shared/ContentCard";
import Link from "next/link";
import { Eye, Trash } from "lucide-react";
import Button from "@/components/shared/Button";
import { ProtectedRoute } from "@/contexts/sessionContext";

export default function PatientPage() {
  const [openNewPatientModal, setOpenNewPatientModal] = useState<boolean>(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPatients() {
      try {
        setIsLoading(true);
        const response = await getAllPatients();
        setPatients(response.patients);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An Error Occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatients();
  }, [openDeleteModal, openNewPatientModal]);

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
      label: "Patients",
      url: "/dashboard/patients",
    },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  async function deletePatient(id: string) {
    try {
      await deletePatientById(id);
      toast.success("Patient Deleted");
      setOpenDeleteModal(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  }

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Patients Management</h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">Manage patients of your clinic here.</p>
          </div>
          <NewPatient
            modalState={openNewPatientModal}
            setModalState={setOpenNewPatientModal}
          />
        </div>
        <ContentCard>
          {/* Table */}
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-20 text-grey-dark dark:text-grey-gc">
                <p className="text-xl">No patients found</p>
                <p className="mt-2">Add a new patient to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light-secondary dark:bg-dark-primary border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                        MR Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                        Full Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                        Gender
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                        Date of Birth
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grey-light dark:divide-grey-dark">
                    {patients?.map((patient) => (
                      <tr
                        key={patient._id}
                        className="hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                          {patient.patientMedicalRecordNumber}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-dark dark:text-white">
                          {patient.patientFullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">{patient.patientGender}</td>
                        <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                          {formatDate(patient.patientDOB)}
                        </td>
                        <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                          {patient.patientWAPhoneNumber}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            href={`/dashboard/patients/${patient._id}`}
                            className="cursor-pointer!"
                          >
                            <button className="text-green-dark dark:text-white mr-4 cursor-pointer hover:opacity-80">
                              <Eye />
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedPatientId(patient._id);
                              setOpenDeleteModal(true);
                            }}
                            className="text-red-500 cursor-pointer hover:opacity-80"
                          >
                            <Trash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Patient count */}
          {!isLoading && patients.length > 0 && (
            <div className="mt-4 text-sm text-grey-dark dark:text-grey-gc">
              Showing {patients.length} patient{patients.length !== 1 ? "s" : ""}
            </div>
          )}
        </ContentCard>

        <div
          className={`${
            openDeleteModal ? "flex justify-center items-center" : "hidden"
          } w-screen h-screen absolute top-0 left-0`}
        >
          <div
            className="bg-green-dark/20 backdrop-blur-sm w-full h-full absolute z-0"
            onClick={() => {
              setOpenDeleteModal(false);
            }}
          ></div>

          <ContentCard className="relative z-1 flex flex-col gap-2">
            <h2 className="text-[20px] font-semibold text-green-dark dark:text-white text-center">
              Delete Confirmation
            </h2>
            <p>Are you sure you want to delete this patient?</p>
            <div className="flex gap-2 justify-center mt-2">
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => deletePatient(selectedPatientId)}
              >
                Delete
              </Button>
              <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
            </div>
          </ContentCard>
        </div>
      </main>
    </ProtectedRoute>
  );
}

