"use client";
import { IMedicalAssessment } from "@/app/types";
import { getMedicalAssessmentsByPatient } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AssessmentDetailPage() {
  const { id: patientId, assessmentId } = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState<IMedicalAssessment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAssessment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, assessmentId]);

  const fetchAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await getMedicalAssessmentsByPatient(patientId as string);
      const assessments = response.medicalAssessments || [];
      
      // Find the specific assessment by ID
      const foundAssessment = assessments.find(
        (a: IMedicalAssessment) => a._id === assessmentId
      );

      if (foundAssessment) {
        setAssessment(foundAssessment);
      } else {
        toast.error("Assessment not found");
        router.push(`/dashboard/patients/${patientId}/assessments`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load assessment");
      router.push(`/dashboard/patients/${patientId}/assessments`);
    } finally {
      setIsLoading(false);
    }
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

  const getPatientName = (): string => {
    if (!assessment) return "";
    if (typeof assessment.patientId === 'string') {
      return assessment.patientId;
    }
    return assessment.patientId.patientFullName;
  };

  const getAssessorName = (): string => {
    if (!assessment) return "";
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
      label: patientId as string,
      url: `/dashboard/patients/${patientId}`,
    },
    {
      label: "Assessments",
      url: `/dashboard/patients/${patientId}/assessments`,
    },
    {
      label: assessmentId as string,
      url: `/dashboard/patients/${patientId}/assessments/${assessmentId}`,
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

  if (!assessment) {
    return (
      <ProtectedRoute>
        <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
          <Breadcrumb data={breadcrumbData} />
          <div className="text-center py-20">
            <p className="text-xl text-grey-dark dark:text-grey-gc">Assessment not found</p>
            <button
              onClick={() => router.push(`/dashboard/patients/${patientId}/assessments`)}
              className="mt-4 px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700"
            >
              Back to Assessments
            </button>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
              Assessment Details
            </h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
              View detailed medical assessment information.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/dashboard/patients/${patientId}/assessments/${assessmentId}/edit`)}
              className="px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Assessment
            </button>
            <button
              onClick={() => router.push(`/dashboard/patients/${patientId}/assessments`)}
              className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Assessment Header Card */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-green-dark dark:text-white">
                Medical Assessment
              </h2>
              <p className="text-grey-dark dark:text-grey-gc mt-1">
                ID: {assessment._id}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-1 bg-green-dark/10 dark:bg-green-dark/20 text-green-dark dark:text-white rounded-full text-sm font-semibold">
                {formatDateTime(assessment.assessmentDate)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Patient
              </label>
              <p className="text-green-dark dark:text-white font-medium">
                {getPatientName()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Assessed By
              </label>
              <p className="text-green-dark dark:text-white font-medium">
                {getAssessorName()}
              </p>
            </div>
          </div>
        </div>

        {/* SOAP Format Cards */}
        <div className="space-y-6">
          {/* Subjective */}
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">S</span>
              </div>
              <h3 className="text-xl font-bold text-green-dark dark:text-white">
                Subjective
              </h3>
            </div>
            <p className="text-grey-dark dark:text-grey-gc text-sm uppercase font-semibold mb-2">
              Patient&apos;s complaints, symptoms, and history
            </p>
            <p className="text-green-dark dark:text-white leading-relaxed whitespace-pre-wrap">
              {assessment.assesementSubjective}
            </p>
          </div>

          {/* Objective */}
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">O</span>
              </div>
              <h3 className="text-xl font-bold text-green-dark dark:text-white">
                Objective
              </h3>
            </div>
            <p className="text-grey-dark dark:text-grey-gc text-sm uppercase font-semibold mb-2">
              Physical examination findings, vital signs, test results
            </p>
            <p className="text-green-dark dark:text-white leading-relaxed whitespace-pre-wrap">
              {assessment.assesementObjective}
            </p>
          </div>

          {/* Assessment & Plan */}
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">A</span>
              </div>
              <h3 className="text-xl font-bold text-green-dark dark:text-white">
                Assessment & Plan
              </h3>
            </div>
            <p className="text-grey-dark dark:text-grey-gc text-sm uppercase font-semibold mb-2">
              Diagnosis, treatment plan, medications, follow-up instructions
            </p>
            <p className="text-green-dark dark:text-white leading-relaxed whitespace-pre-wrap">
              {assessment.assesementDiagnosisAndAction}
            </p>
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        <div className="flex gap-4 mt-8 justify-end">
          <button
            onClick={() => router.push(`/dashboard/patients/${patientId}`)}
            className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
          >
            View Patient
          </button>
          <button
            onClick={() => router.push(`/dashboard/patients/${patientId}/assessments`)}
            className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
          >
            All Assessments
          </button>
          <button
            onClick={() => router.push(`/dashboard/patients/${patientId}/assessments/${assessmentId}/edit`)}
            className="px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Edit Assessment
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}