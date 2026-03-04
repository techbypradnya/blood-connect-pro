const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.errors?.map((e: { message: string }) => e.message).join(", ") || "Something went wrong");
  }

  return data;
}

// ---- Auth ----
export const authApi = {
  register: (body: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    bloodGroup: string;
    city: string;
    state: string;
  }) => apiRequest<{ success: boolean; data: AuthUser }>("/auth/register", { method: "POST", body }),

  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; data: AuthUser }>("/auth/login", { method: "POST", body: { email, password } }),

  resendVerification: (email: string) =>
    apiRequest<{ success: boolean; message: string }>("/auth/resend-verification", { method: "POST", body: { email } }),
};

// ---- Donors ----
export const donorApi = {
  getAll: () => apiRequest<{ success: boolean; count: number; data: DonorResult[] }>("/donors"),

  search: (params: { bloodGroup?: string; city?: string; state?: string }) => {
    const query = new URLSearchParams();
    if (params.bloodGroup) query.set("bloodGroup", params.bloodGroup);
    if (params.city) query.set("city", params.city);
    if (params.state) query.set("state", params.state);
    return apiRequest<{ success: boolean; count: number; data: DonorResult[] }>(`/donors/search?${query.toString()}`);
  },

  updateAvailability: (available: boolean, token: string) =>
    apiRequest<{ success: boolean; data: { available: boolean } }>("/donors/availability", {
      method: "PUT",
      body: { available },
      token,
    }),
};

// ---- Users ----
export const userApi = {
  getById: (id: string, token: string) =>
    apiRequest<{ success: boolean; data: DonorResult }>(`/users/${id}`, { token }),

  update: (id: string, body: Partial<DonorResult>, token: string) =>
    apiRequest<{ success: boolean; data: DonorResult; eligibility: EligibilityResult }>(`/users/${id}`, { method: "PUT", body, token }),

  getEligibility: (id: string, token: string) =>
    apiRequest<{ success: boolean; data: EligibilityResult }>(`/users/${id}/eligibility`, { token }),
};

// ---- Blood Requests ----
export const requestApi = {
  create: (body: {
    bloodGroup: string;
    unitsRequired: number;
    hospitalName: string;
    city: string;
    contactNumber: string;
  }, token: string) =>
    apiRequest<{ success: boolean; data: BloodRequestResult }>("/requests", { method: "POST", body, token }),

  getAll: () =>
    apiRequest<{ success: boolean; count: number; data: BloodRequestResult[] }>("/requests"),
};

// ---- Types ----
export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  bloodGroup: string;
  city: string;
  state: string;
  available: boolean;
  token: string;
  // Medical fields
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  hemoglobin?: number;
  bloodPressure?: string;
  lastDonationDate?: string;
  hasMedicalConditions?: boolean;
  medicalConditionsDesc?: string;
  recentSurgery?: boolean;
  onMedication?: boolean;
}

export interface DonorResult {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  bloodGroup: string;
  city: string;
  state: string;
  available: boolean;
  createdAt: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  hemoglobin?: number;
  bloodPressure?: string;
  lastDonationDate?: string;
  hasMedicalConditions?: boolean;
  medicalConditionsDesc?: string;
  recentSurgery?: boolean;
  onMedication?: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  bmi: number | null;
}

export interface BloodRequestResult {
  _id: string;
  requestedBy: { fullName: string; email: string; phone: string };
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  city: string;
  contactNumber: string;
  status: string;
  createdAt: string;
}
