"use client";
import { IPatient, IMedicalAssessment } from "@/app/types";
import { getPatientById, getMedicalAssessmentsByPatient } from "@/client/client";
import NewAssessment from "@/components/dashboard/NewAssessment";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PatientAssessmentsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [openNewAssessment, setOpenNewAssessment] = useState<boolean>(false);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [assessments, setAssessments] = useState<IMedicalAssessment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState<boolean>(true);

  useEffect(() => {
    fetchPatientData();
    fetchAssessments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setIsLoading(true);
      const response = await getPatientById(id as string);
      setPatient(response.patient);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load patient data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      setIsLoadingAssessments(true);
      const response = await getMedicalAssessmentsByPatient(id as string);
      setAssessments(response.medicalAssessments || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load assessments");
    } finally {
      setIsLoadingAssessments(false);
    }
  };

  const handleAssessmentCreated = () => {
    fetchAssessments();
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssessorName = (assessment: IMedicalAssessment): string => {
    if (typeof assessment.assessmentBy === 'string') {
      return assessment.assessmentBy;
    }
    return assessment.assessmentBy.username;
  };

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
    {
      label: "Assessments",
      url: `/dashboard/patients/${id}/assessments`,
    },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
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

        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
              Patient Assessments
            </h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
              View all assessments for {patient?.patientFullName || 'this patient'} or create a new one here.
            </p>
          </div>
          <div className="flex gap-3">
            <NewAssessment
              modalState={openNewAssessment}
              setModalState={setOpenNewAssessment}
              patientId={id as string}
              onAssessmentCreated={handleAssessmentCreated}
            />
            <button
              onClick={() => router.push(`/dashboard/patients/${id}`)}
              className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
            >
              Back to Patient
            </button>
          </div>
        </div>

        {/* Patient Info Card */}
        {patient && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-green-dark dark:text-white">
                  {patient.patientFullName}
                </h2>
                <p className="text-grey-dark dark:text-grey-gc mt-1">
                  MR: {patient.patientMedicalRecordNumber} • {patient.patientGender}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-grey-dark dark:text-grey-gc">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold text-green-dark dark:text-white">
                  {assessments.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Assessments List */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
          {isLoadingAssessments ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-20 text-grey-dark dark:text-grey-gc">
              <p className="text-xl">No assessments found</p>
              <p className="mt-2">Create a new assessment to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-grey-light dark:divide-grey-dark p-2.5">
              {assessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="p-6 hover:bg-light-primary dark:hover:bg-dark-primary transition-colors cursor-pointer border-b border-green-dark/20 dark:border-white/20"
                  onClick={() => router.push(`/dashboard/patients/${id}/assessments/${assessment._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">
                        {formatDateTime(assessment.assessmentDate)}
                      </p>
                      <p className="text-sm text-grey-dark dark:text-grey-gc mt-1">
                        Assessed by: {getAssessorName(assessment)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/patients/${id}/assessments/${assessment._id}`);
                      }}
                      className="text-green-dark dark:text-white hover:underline text-sm font-semibold"
                    >
                      View Details →
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                        Subjective (S)
                      </p>
                      <p className="text-sm text-green-dark dark:text-white line-clamp-2">
                        {assessment.assesementSubjective}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                        Objective (O)
                      </p>
                      <p className="text-sm text-green-dark dark:text-white line-clamp-2">
                        {assessment.assesementObjective}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                        Assessment & Plan (A)
                      </p>
                      <p className="text-sm text-green-dark dark:text-white line-clamp-2">
                        {assessment.assesementDiagnosisAndAction}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assessment count */}
        {!isLoadingAssessments && assessments.length > 0 && (
          <div className="mt-4 text-sm text-grey-dark dark:text-grey-gc">
            Showing {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}