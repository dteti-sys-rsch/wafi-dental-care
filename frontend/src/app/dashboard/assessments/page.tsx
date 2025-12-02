"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { IMedicalAssessment } from "@/app/types";
import { getAllAssessments } from "@/client/client";
import { useRouter } from "next/navigation";
import NewAssessment from "@/components/dashboard/NewAssessment";

export default function AssessmentsPage() {
  const router = useRouter();
  const [openNewAssessmentModal, setOpenNewAssessmentModal] = useState<boolean>(false);
  const [assessments, setAssessments] = useState<IMedicalAssessment[]>([]);
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
      label: "Assessments",
      url: "/dashboard/assessments",
    },
  ];

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssessments();
      setAssessments(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load assessments");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPatientName = (assessment: IMedicalAssessment): string => {
    if (typeof assessment.patientId === 'string') {
      return assessment.patientId;
    }
    return assessment.patientId.patientFullName;
  };

  const getAssessorName = (assessment: IMedicalAssessment): string => {
    if (typeof assessment.assessmentBy === 'string') {
      return assessment.assessmentBy;
    }
    return assessment.assessmentBy.username;
  };

  const handleViewAssessment = (id: string) => {
    router.push(`/dashboard/assessments/${id}`);
  };

  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
            Medical Assessments
          </h1>
          <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
            Manage medical assessments for your clinic patients here.
          </p>
        </div>
        <NewAssessment 
          modalState={openNewAssessmentModal} 
          setModalState={setOpenNewAssessmentModal}
          onAssessmentCreated={fetchAssessments}
        />
      </div>

      {/* Table */}
      <div className="mt-8 bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-20 text-grey-dark dark:text-grey-gc">
            <p className="text-xl">No assessments found</p>
            <p className="mt-2">Create a new assessment to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-primary dark:bg-dark-primary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Assessment Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Assessed By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Diagnosis Preview
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-light dark:divide-grey-dark">
                {assessments.map((assessment) => (
                  <tr 
                    key={assessment._id}
                    className="hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                      {formatDate(assessment.assessmentDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-dark dark:text-white">
                      {getPatientName(assessment)}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                      {getAssessorName(assessment)}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                      <div className="max-w-xs truncate">
                        {assessment.assesementDiagnosisAndAction}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewAssessment(assessment._id)}
                        className="text-green-dark dark:text-white hover:underline mr-4"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/assessments/${assessment._id}/edit`)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assessment count */}
      {!isLoading && assessments.length > 0 && (
        <div className="mt-4 text-sm text-grey-dark dark:text-grey-gc">
          Showing {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}
        </div>
      )}
    </main>
  );
}