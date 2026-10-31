import { demoBackend } from './demoBackend';

// Set VITE_API_BASE_URL in a .env file to point at another backend.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Demo mode answers every request from an in-memory sample backend
// (src/services/demoBackend.ts), so the UI can be tried without the API.
// Enabled by `npm run dev:demo` / `npm run build:demo`, or VITE_DEMO_MODE=true.
export const DEMO_MODE: boolean =
  import.meta.env.MODE === 'demo' || import.meta.env.VITE_DEMO_MODE === 'true';

export interface RegisterRequest {
  studentId?: number;
  name: string;
  email: string;
  password: string;
}

export interface InstructorRegisterRequest {
  instructorId: number;
  name: string;
  email: string;
  password: string;
}

export interface TechnicianRegisterRequest {
  technicianId: number;
  name: string;
  email: string;
  password: string;
}

export interface DoctorRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  studentId?: number;
  instructorId?: number;
  technicianId?: number;
  doctorId?: number;
  name: string;
  email: string;
  role: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
}

// Store token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/** Error thrown for non-2xx responses; carries the HTTP status. */
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Attach the stored bearer token (default true). Auth endpoints pass false. */
  auth?: boolean;
  /** Message used when the server gives no usable error body. */
  fallbackMessage: string;
}

/**
 * Single place that talks to the REST API: adds JSON/auth headers, turns
 * network failures and non-JSON error bodies into readable errors, and clears
 * the stored token on 401 for authenticated calls. Does not consult DEMO_MODE.
 */
export async function request<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const { method = 'GET', body, auth = true, fallbackMessage } = options;
  const token = auth ? getAuthToken() : null;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }

  if (!response.ok) {
    if (auth && response.status === 401) {
      removeAuthToken();
      throw new ApiError('Unauthorized. Please login again.', 401);
    }
    const error: Partial<ErrorResponse> | null = await response.json().catch(() => null);
    throw new ApiError(error?.message || fallbackMessage, response.status);
  }

  // DELETE (and other empty-body responses) may return 204 or an empty body.
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function authenticate(
  endpoint: string,
  data: unknown,
  fallbackMessage: string,
): Promise<AuthResponse> {
  const result = await request<AuthResponse>(endpoint, {
    method: 'POST',
    body: data,
    auth: false,
    fallbackMessage,
  });
  setAuthToken(result.token);
  return result;
}

async function demoAuth(call: Promise<AuthResponse>): Promise<AuthResponse> {
  const r = await call;
  setAuthToken(r.token);
  return r;
}

// API functions
export const api = {
  register(data: RegisterRequest): Promise<AuthResponse> {
    if (DEMO_MODE) return demoAuth(demoBackend.register('student', data));
    return authenticate('/auth/register', data, 'Registration failed');
  },

  registerInstructor(data: InstructorRegisterRequest): Promise<AuthResponse> {
    if (DEMO_MODE) return demoAuth(demoBackend.register('instructor', data));
    return authenticate('/auth/register/instructor', data, 'Registration failed');
  },

  registerTechnician(data: TechnicianRegisterRequest): Promise<AuthResponse> {
    if (DEMO_MODE) return demoAuth(demoBackend.register('technician', data));
    return authenticate('/auth/register/technician', data, 'Registration failed');
  },

  registerDoctor(data: DoctorRegisterRequest): Promise<AuthResponse> {
    if (DEMO_MODE) return demoAuth(demoBackend.register('doctor', data));
    return authenticate('/auth/register/doctor', data, 'Registration failed');
  },

  login(data: LoginRequest): Promise<AuthResponse> {
    if (DEMO_MODE) return demoAuth(demoBackend.login(data.email));
    return authenticate('/auth/login', data, 'Login failed');
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers narrow per endpoint
  get(endpoint: string): Promise<any> {
    if (DEMO_MODE) return demoBackend.get(endpoint);
    return request(endpoint, { fallbackMessage: `Failed to fetch ${endpoint}` });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers narrow per endpoint
  post(endpoint: string, data: unknown): Promise<any> {
    if (DEMO_MODE) return demoBackend.post(endpoint, data);
    return request(endpoint, {
      method: 'POST',
      body: data,
      fallbackMessage: `Failed to post to ${endpoint}`,
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers narrow per endpoint
  put(endpoint: string, data: unknown): Promise<any> {
    if (DEMO_MODE) return demoBackend.put(endpoint, data);
    return request(endpoint, {
      method: 'PUT',
      body: data,
      fallbackMessage: `Failed to put to ${endpoint}`,
    });
  },

  async delete(endpoint: string): Promise<void> {
    if (DEMO_MODE) return demoBackend.delete(endpoint);
    await request<void>(endpoint, {
      method: 'DELETE',
      fallbackMessage: `Failed to delete ${endpoint}`,
    });
  },
};

// Type definitions for backend entities
export interface Lab {
  labId: number;
  labName: string;
  location: string;
  capacity: number;
  requiredLevel: number;
  instructor?: {
    instructorId: number;
    instructorName: string;
    instructorEmail: string;
  };
  equipmentList?: Equipment[];
}

export interface Equipment {
  equipmentName: string;
  status: string;
  lab?: Lab;
}

export interface Reservation {
  reservationId: number;
  equipment: Equipment;
  student: {
    studentId: number;
    name: string;
    email: string;
  };
  supervisor?: {
    instructorId: number;
    instructorName: string;
  };
  date: string;
  time: string;
  duration: number;
  purpose: string;
  reservationType: string;
  teamSize: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SharedTool {
  toolId: number;
  toolName: string;
  description: string;
  imageUrl?: string;
  owner: {
    studentId: number;
    name: string;
    email: string;
  };
  contactEmail: string;
}

export interface CreateReservationRequest {
  equipmentName: string;
  studentId: number;
  supervisorId?: number;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  reservationType: string;
  teamSize: number;
}

export interface CreateSharedToolRequest {
  toolName: string;
  description: string;
  imageUrl?: string;
  ownerStudentId: number;
}

export interface Research {
  researchId: number;
  lab?: Lab;
  doctorEmail?: string;
  student?: {
    studentId: number;
    name: string;
    email: string;
  };
  title: string;
  startDate: string;
  endDate: string;
}
