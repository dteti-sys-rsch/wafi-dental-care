"use client";
import { Gender } from "@/app/types";
import { getPatientById, editPatientById } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditPatientPage() {
  const { id } = useParams();
  const router = useRouter();

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
      label: "Edit",
      url: `/dashboard/patients/${id}/edit`,
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Form fields
  const [medicalRecordNumber, setMedicalRecordNumber] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [birthPlace, setBirthPlace] = useState<string>("");
  const [gender, setGender] = useState<Gender | "">("");
  const [address, setAddress] = useState<string>("");
  const [nik, setNik] = useState<string>("");
  const [waNumber, setWaNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function fetchPatientData() {
      try {
        setIsLoading(true);
        const response = await getPatientById(id as string);
        const patient = response.patient;

        // Populate form fields
        setMedicalRecordNumber(patient.patientMedicalRecordNumber);
        setFullName(patient.patientFullName);
        setDob(new Date(patient.patientDOB).toISOString().split('T')[0]); // Format to YYYY-MM-DD
        setBirthPlace(patient.patientBirthPlace);
        setGender(patient.patientGender);
        setAddress(patient.patientAddress);
        setNik(patient.patientNIK.toString());
        setWaNumber(patient.patientWAPhoneNumber.toString());
        setEmail(patient.patientEmail || "");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load patient data");
        router.push("/dashboard/patients");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatientData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName || !dob || !birthPlace || !gender || !address || !nik || !waNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        medicalRecordNumber,
        fullname: fullName,
        DOB: dob,
        birthPlace,
        gender,
        address,
        NIK: parseInt(nik),
        WAPhoneNumber: parseInt(waNumber),
        email: email || undefined,
      };

      await editPatientById(id as string, payload);
      
      toast.success("Patient updated successfully!");
      router.push(`/dashboard/patients/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update patient");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/patients/${id}`);
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

  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
      <Breadcrumb data={breadcrumbData} />

      <div className="mb-6">
        <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
          Edit Patient
        </h1>
        <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
          Update patient information for your clinic.
        </p>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medical Record Number */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              Medical Record Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={medicalRecordNumber}
              onChange={(e) => setMedicalRecordNumber(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            />
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            />
          </div>

          {/* Place of Birth */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              Place of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            >
              <option value="" disabled className="bg-dark-secondary">
                Select Gender
              </option>
              <option value={Gender.MALE} className="bg-dark-secondary">
                {Gender.MALE}
              </option>
              <option value={Gender.FEMALE} className="bg-dark-secondary">
                {Gender.FEMALE}
              </option>
            </select>
          </div>

          {/* NIK */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              NIK <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="uppercase font-bold text-grey-gc">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
            />
          </div>

          {/* Address - Full Width */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="uppercase font-bold text-grey-gc">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white resize-none"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 bg-grey-dark hover:bg-slate-600 text-white rounded-md hover:bg-grey-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </main>
  );
}