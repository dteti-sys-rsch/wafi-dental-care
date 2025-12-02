import { Gender } from "@/app/types";

//! USE LOGIN IN SESSION CONTEXT INSTEAD
export async function login(username: string, password: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}, ${await response.text()}`);
  }

  return response.json();
}

export async function getAllPatients() {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/patient", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}, ${await response.text()}`);
  }

  return response.json();
}

export async function createNewPatient(patientData: {
  medicalRecordNumber: string;
  fullname: string;
  DOB: string;
  birthPlace: string;
  gender: Gender;
  address: string;
  NIK: string;
  WAPhoneNumber: string;
  email: string;
}) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/patient/register", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(patientData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 401) {
    throw new Error("Authentication Error");
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.status}, ${await response.text()}`);
  }

  return response.json();
}

export async function getPatientById(patientId: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/patient/" + patientId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (response.status == 201) {
    throw new Error("Authentication Error");
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.status}, ${response.text()}`);
  }

  return response.json();
}

export async function editPatientById(patientId: string, data: unknown) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient/edit/${patientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update patient");
  }

  return response.json();
}

export async function deletePatientById(patientId: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/patient/delete/" + patientId, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 401) {
    throw new Error("Authentication Error")
  }

    if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update patient");
  }

  return response.json();
}

export async function getAllAssessments() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessment/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assessments');
  }

  return response.json();
}

export async function createAssessment(data: unknown) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medicalassessment/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create assessment');
  }

  return response.json();
}

export async function getMedicalAssessmentsByPatient(patientId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient/medicalassessment/${patientId}`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch assessments');
  }

  return response.json();
}

// client/client.ts
export async function getAllUsers() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function createUser(data: unknown) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
}

export async function deleteUser(userId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/delete/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }

  return response.json();
}

export async function getAllBranches() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/branch/`, {
    method: "GET",
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch branches');
  }

  return response.json();
}