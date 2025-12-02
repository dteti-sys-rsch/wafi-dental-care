"use client";
import { IPatient } from "@/app/types";
import { getPatientById } from "@/client/client";
import NewAssessment from "@/components/dashboard/NewAssessment";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [openNewAssessment, setOpenNewAssessment] = useState<boolean>(false);

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
    {
      label: id as string,
      url: `/dashboard/patients/${id}`,
    },
  ];

  const [patient, setPatient] = useState<IPatient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        setIsLoading(true);
        const response = await getPatientById(id as string);
        setPatient(response.patient);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load patient data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatientData();
  }, [id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
        </div>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />
        <div className="text-center py-20">
          <p className="text-xl text-grey-dark dark:text-grey-gc">Patient not found</p>
          <button
            onClick={() => router.push("/dashboard/patients")}
            className="mt-4 px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700"
          >
            Back to Patients
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
      <Breadcrumb data={breadcrumbData} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Patient Details</h1>
          <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
            View or edit a patient of your clinic here.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/dashboard/patients/${id}/edit`)}
            className="px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Edit Patient
          </button>
          <button
            onClick={() => router.push("/dashboard/patients")}
            className="px-6 py-2 bg-grey-dark hover:bg-slate-600 text-white rounded-md hover:bg-grey-700 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-dark dark:text-white">{patient.patientFullName}</h2>
            <p className="text-grey-dark dark:text-grey-gc mt-1">MR: {patient.patientMedicalRecordNumber}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-1 bg-green-dark/10 dark:bg-green-dark/20 text-green-dark dark:text-white rounded-full text-sm font-semibold">
              {patient.patientGender}
            </span>
          </div>
        </div>

        {/* Personal Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Date of Birth
              </label>
              <p className="text-green-dark dark:text-white font-medium">
                {formatDate(patient.patientDOB)} ({calculateAge(patient.patientDOB)} years old)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Place of Birth
              </label>
              <p className="text-green-dark dark:text-white font-medium">{patient.patientBirthPlace}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">NIK</label>
              <p className="text-green-dark dark:text-white font-medium">{patient.patientNIK}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                WhatsApp Number
              </label>
              <p className="text-green-dark dark:text-white font-medium">{patient.patientWAPhoneNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Email
              </label>
              <p className="text-green-dark dark:text-white font-medium">{patient.patientEmail || "Not provided"}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Address
              </label>
              <p className="text-green-dark dark:text-white font-medium">{patient.patientAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease History Card */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-green-dark dark:text-white mb-4">Disease History</h3>
          {patient.patientDiseaseHistory.length > 0 ? (
            <ul className="space-y-2">
              {patient.patientDiseaseHistory.map((disease, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-grey-dark dark:text-grey-gc"
                >
                  <span className="w-2 h-2 bg-green-dark rounded-full"></span>
                  {typeof disease === "string" ? disease : disease._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-grey-dark dark:text-grey-gc italic">No disease history recorded</p>
          )}
        </div>

        {/* Medical Assessments Card */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-green-dark dark:text-white">Medical Assessments</h3>
          <NewAssessment modalState={openNewAssessment} setModalState={setOpenNewAssessment} patientId={id as string} />
          </div>
          {patient.patientMedicalAssessments.length > 0 ? (
            <ul className="space-y-2">
              {patient.patientMedicalAssessments.map((assessment, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-grey-dark dark:text-grey-gc"
                >
                  <span className="w-2 h-2 bg-green-dark rounded-full"></span>
                  {typeof assessment === "string" ? assessment : assessment._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-grey-dark dark:text-grey-gc italic">No medical assessments recorded</p>
          )}
        </div>
      </div>
    </main>
  );
}
