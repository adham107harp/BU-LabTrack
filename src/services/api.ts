const API_BASE_URL = 'http://localhost:8080/api';

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

// API functions
export const api = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    setAuthToken(result.token);
    return result;
  },

  async registerInstructor(data: InstructorRegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/instructor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    setAuthToken(result.token);
    return result;
  },

  async registerTechnician(data: TechnicianRegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/technician`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    setAuthToken(result.token);
    return result;
  },

  async registerDoctor(data: DoctorRegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/doctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    setAuthToken(result.token);
    return result;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result: AuthResponse = await response.json();
    setAuthToken(result.token);
    return result;
  },

  async get(endpoint: string): Promise<any> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('Unauthorized. Please login again.');
      }
      const error: ErrorResponse = await response.json().catch(() => ({ message: `Failed to fetch ${endpoint}` }));
      throw new Error(error.message || `Failed to fetch ${endpoint}`);
    }

    return response.json();
  },

  async post(endpoint: string, data: any): Promise<any> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('Unauthorized. Please login again.');
      }
      const error: ErrorResponse = await response.json().catch(() => ({ message: `Failed to post to ${endpoint}` }));
      throw new Error(error.message || `Failed to post to ${endpoint}`);
    }

    return response.json();
  },

  async put(endpoint: string, data: any): Promise<any> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('Unauthorized. Please login again.');
      }
      const error: ErrorResponse = await response.json().catch(() => ({ message: `Failed to put to ${endpoint}` }));
      throw new Error(error.message || `Failed to put to ${endpoint}`);
    }

    return response.json();
  },

  async delete(endpoint: string): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('Unauthorized. Please login again.');
      }
      const error: ErrorResponse = await response.json().catch(() => ({ message: `Failed to delete ${endpoint}` }));
      throw new Error(error.message || `Failed to delete ${endpoint}`);
    }
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

