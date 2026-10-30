/**
 * In-memory stand-in for the BU-LabTrack REST API, used when the app runs in
 * demo mode (`npm run dev:demo` / `npm run build:demo`). It answers the same
 * endpoints the screens call, with the same response shapes, so the whole UI
 * can be tried without the backend. Data lives only in memory and resets on
 * page reload.
 */
import type {
  AuthResponse,
  CreateReservationRequest,
  CreateSharedToolRequest,
  Equipment,
  Lab,
  Reservation,
  Research,
  SharedTool,
} from './api';

type Role = 'student' | 'instructor' | 'technician' | 'doctor';

interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface StoredEquipment {
  equipmentName: string;
  status: string;
  labId: number;
}

interface MaintenanceRequest {
  maintenanceId: number;
  equipmentName: string;
  technicianId: number;
  requestDate: string;
  status: string;
  description: string;
  nextMaintenanceDate?: string;
  maintenanceFrequencyDays?: number;
  estimatedDurationHours?: number;
}

/** Accounts shown on the login screen in demo mode. Any password works. */
export const DEMO_ACCOUNTS: DemoUser[] = [
  { id: 1, name: 'Demo Student', email: 'student@demo.bu.edu', role: 'student' },
  { id: 2, name: 'Demo Instructor', email: 'instructor@demo.bu.edu', role: 'instructor' },
  { id: 3, name: 'Demo Technician', email: 'technician@demo.bu.edu', role: 'technician' },
  { id: 4, name: 'Demo Doctor', email: 'doctor@demo.bu.edu', role: 'doctor' },
];

const OTHER_INSTRUCTOR = {
  instructorId: 9,
  instructorName: 'Eng. Lab Supervisor',
  instructorEmail: 'supervisor@demo.bu.edu',
};

function day(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function minutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

const users: DemoUser[] = [...DEMO_ACCOUNTS];
let nextUserId = 100;

const labs: Omit<Lab, 'equipmentList'>[] = [
  {
    labId: 101,
    labName: 'Computer Networks Lab',
    location: 'Building A, 1',
    capacity: 30,
    requiredLevel: 1,
    instructor: {
      instructorId: 2,
      instructorName: 'Demo Instructor',
      instructorEmail: 'instructor@demo.bu.edu',
    },
  },
  {
    labId: 102,
    labName: 'Electronics Lab',
    location: 'Building A, 2',
    capacity: 25,
    requiredLevel: 2,
    instructor: {
      instructorId: 2,
      instructorName: 'Demo Instructor',
      instructorEmail: 'instructor@demo.bu.edu',
    },
  },
  {
    labId: 103,
    labName: 'AI & Data Science Lab',
    location: 'Building B, 3',
    capacity: 35,
    requiredLevel: 2,
    instructor: OTHER_INSTRUCTOR,
  },
  {
    labId: 104,
    labName: 'Physics Lab',
    location: 'Building C, 1',
    capacity: 40,
    requiredLevel: 1,
    instructor: OTHER_INSTRUCTOR,
  },
  {
    labId: 255,
    labName: 'IoT Research Lab',
    location: 'Research Center, 2',
    capacity: 12,
    requiredLevel: 4,
    instructor: {
      instructorId: 2,
      instructorName: 'Demo Instructor',
      instructorEmail: 'instructor@demo.bu.edu',
    },
  },
  {
    labId: 256,
    labName: 'Biomedical Research Lab',
    location: 'Research Center, 3',
    capacity: 10,
    requiredLevel: 4,
    instructor: OTHER_INSTRUCTOR,
  },
];

const equipment: StoredEquipment[] = [
  { equipmentName: 'Cisco Router 2901', status: 'AVAILABLE', labId: 101 },
  { equipmentName: 'Cisco Switch 2960', status: 'AVAILABLE', labId: 101 },
  { equipmentName: 'Network Cable Tester', status: 'UNAVAILABLE', labId: 101 },
  { equipmentName: 'Digital Oscilloscope', status: 'AVAILABLE', labId: 102 },
  { equipmentName: 'Function Generator', status: 'MAINTENANCE', labId: 102 },
  { equipmentName: 'Soldering Station', status: 'AVAILABLE', labId: 102 },
  { equipmentName: 'GPU Workstation (RTX 4090)', status: 'AVAILABLE', labId: 103 },
  { equipmentName: 'Jetson Nano Kit', status: 'UNAVAILABLE', labId: 103 },
  { equipmentName: 'Spectrometer', status: 'AVAILABLE', labId: 104 },
  { equipmentName: 'Laser Optics Kit', status: 'AVAILABLE', labId: 104 },
  { equipmentName: 'Raspberry Pi 5 Cluster', status: 'AVAILABLE', labId: 255 },
  { equipmentName: 'LoRaWAN Gateway', status: 'MAINTENANCE', labId: 255 },
  { equipmentName: 'ECG Signal Analyzer', status: 'AVAILABLE', labId: 256 },
];

const student = (id: number) => {
  const u = users.find((x) => x.id === id) ?? DEMO_ACCOUNTS[0];
  return { studentId: u.id, name: u.name, email: u.email };
};

const reservations: {
  id: number;
  equipmentName: string;
  studentId: number;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  reservationType: string;
  teamSize: number;
  status: Reservation['status'];
}[] = [
  {
    id: 1,
    equipmentName: 'Cisco Router 2901',
    studentId: 1,
    date: day(1),
    time: '10:00',
    duration: 90,
    purpose: 'Routing lab assignment',
    reservationType: 'EQUIPMENT',
    teamSize: 3,
    status: 'APPROVED',
  },
  {
    id: 2,
    equipmentName: 'Digital Oscilloscope',
    studentId: 1,
    date: day(2),
    time: '13:00',
    duration: 60,
    purpose: 'Signals course project',
    reservationType: 'EQUIPMENT',
    teamSize: 2,
    status: 'PENDING',
  },
  {
    id: 3,
    equipmentName: 'Soldering Station',
    studentId: 1,
    date: day(-3),
    time: '09:00',
    duration: 120,
    purpose: 'Sensor board prototype',
    reservationType: 'EQUIPMENT',
    teamSize: 1,
    status: 'REJECTED',
  },
  {
    id: 4,
    equipmentName: 'Cisco Switch 2960',
    studentId: 1,
    date: day(3),
    time: '11:00',
    duration: 60,
    purpose: 'VLAN practice',
    reservationType: 'EQUIPMENT',
    teamSize: 4,
    status: 'PENDING',
  },
];
let nextReservationId = 5;

let sharedTools: SharedTool[] = [
  {
    toolId: 1,
    toolName: 'Arduino Uno Starter Kit',
    description: 'Full kit with breadboard, sensors and jumper wires.',
    owner: student(1),
    contactEmail: 'student@demo.bu.edu',
  },
  {
    toolId: 2,
    toolName: 'Digital Multimeter',
    description: 'Auto-ranging multimeter, good for circuits labs.',
    owner: { studentId: 50, name: 'Omar (Year 3)', email: 'omar@demo.bu.edu' },
    contactEmail: 'omar@demo.bu.edu',
  },
  {
    toolId: 3,
    toolName: 'USB Logic Analyzer',
    description: '8 channels, 24 MHz. Works with PulseView.',
    owner: { studentId: 51, name: 'Mariam (Year 4)', email: 'mariam@demo.bu.edu' },
    contactEmail: 'mariam@demo.bu.edu',
  },
];
let nextToolId = 4;

const research: {
  researchId: number;
  labId: number;
  doctorEmail: string;
  title: string;
  startDate: string;
  endDate: string;
}[] = [
  {
    researchId: 1,
    labId: 255,
    doctorEmail: 'doctor@demo.bu.edu',
    title: 'Anomaly detection for IoT networks',
    startDate: day(-120),
    endDate: day(90),
  },
  {
    researchId: 2,
    labId: 256,
    doctorEmail: 'doctor@demo.bu.edu',
    title: 'Wearable ECG signal classification',
    startDate: day(30),
    endDate: day(240),
  },
  {
    researchId: 3,
    labId: 255,
    doctorEmail: 'doctor@demo.bu.edu',
    title: 'LoRaWAN coverage study on campus',
    startDate: day(-300),
    endDate: day(-20),
  },
];

const maintenance: MaintenanceRequest[] = [
  {
    maintenanceId: 1,
    equipmentName: 'Function Generator',
    technicianId: 3,
    requestDate: day(-2),
    status: 'PENDING',
    description: 'Output amplitude drifts after 10 minutes of use.',
    maintenanceFrequencyDays: 180,
    estimatedDurationHours: 2,
  },
  {
    maintenanceId: 2,
    equipmentName: 'LoRaWAN Gateway',
    technicianId: 3,
    requestDate: day(-6),
    status: 'IN_PROGRESS',
    description: 'Firmware update and antenna check.',
    nextMaintenanceDate: day(1),
    estimatedDurationHours: 3,
  },
  {
    maintenanceId: 3,
    equipmentName: 'Cisco Router 2901',
    technicianId: 3,
    requestDate: day(-30),
    status: 'COMPLETED',
    description: 'Routine inspection.',
    maintenanceFrequencyDays: 90,
    estimatedDurationHours: 1,
  },
];

// ---------------------------------------------------------------- helpers

function labSummary(labId: number): Lab | undefined {
  const lab = labs.find((l) => l.labId === labId);
  return lab ? { ...lab } : undefined;
}

function equipmentDto(e: StoredEquipment): Equipment {
  return { equipmentName: e.equipmentName, status: e.status, lab: labSummary(e.labId) };
}

function labDto(lab: Omit<Lab, 'equipmentList'>): Lab {
  return {
    ...lab,
    equipmentList: equipment
      .filter((e) => e.labId === lab.labId)
      .map((e) => ({ equipmentName: e.equipmentName, status: e.status })),
  };
}

function reservationDto(r: (typeof reservations)[number]): Reservation {
  const eq = equipment.find((e) => e.equipmentName === r.equipmentName);
  return {
    reservationId: r.id,
    equipment: eq ? equipmentDto(eq) : { equipmentName: r.equipmentName, status: 'AVAILABLE' },
    student: student(r.studentId),
    date: r.date,
    time: r.time,
    duration: r.duration,
    purpose: r.purpose,
    reservationType: r.reservationType,
    teamSize: r.teamSize,
    status: r.status,
  };
}

function researchDto(r: (typeof research)[number]): Research {
  return {
    researchId: r.researchId,
    lab: labSummary(r.labId),
    doctorEmail: r.doctorEmail,
    title: r.title,
    startDate: r.startDate,
    endDate: r.endDate,
  };
}

function authResponse(u: DemoUser): AuthResponse {
  return {
    token: `demo-token-${u.id}`,
    ...(u.role === 'student' && { studentId: u.id }),
    ...(u.role === 'instructor' && { instructorId: u.id }),
    ...(u.role === 'technician' && { technicianId: u.id }),
    ...(u.role === 'doctor' && { doctorId: u.id }),
    name: u.name,
    email: u.email,
    role: u.role,
    message: 'Demo mode',
  };
}

const latency = () => new Promise((r) => setTimeout(r, 250));
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

function notFound(endpoint: string): never {
  throw new Error(`Demo mode: no handler for ${endpoint}`);
}

// ---------------------------------------------------------------- API

export const demoBackend = {
  async login(email: string): Promise<AuthResponse> {
    await latency();
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u) throw new Error('Demo mode: use one of the demo accounts shown below the form.');
    return authResponse(u);
  },

  async register(
    role: Role,
    data: {
      name: string;
      email: string;
      studentId?: number;
      instructorId?: number;
      technicianId?: number;
    },
  ): Promise<AuthResponse> {
    await latency();
    if (users.some((x) => x.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const id = data.studentId ?? data.instructorId ?? data.technicianId ?? nextUserId++;
    const u: DemoUser = { id, name: data.name, email: data.email, role };
    users.push(u);
    return authResponse(u);
  },

  async get(endpoint: string): Promise<any> {
    await latency();
    const [path, query = ''] = endpoint.split('?');
    const params = new URLSearchParams(query);
    let m: RegExpMatchArray | null;

    if (path === '/labs') return clone(labs.map(labDto));
    if (path === '/labs/available') {
      return clone(
        labs.map(labDto).filter((l) => l.equipmentList?.some((e) => e.status === 'AVAILABLE')),
      );
    }
    if (path === '/equipment') return clone(equipment.map(equipmentDto));
    if ((m = path.match(/^\/equipment\/lab\/(\d+)$/))) {
      return clone(equipment.filter((e) => e.labId === Number(m![1])).map(equipmentDto));
    }
    if (path === '/reservations') return clone(reservations.map(reservationDto));
    if (path === '/reservations/check-availability') {
      const name = params.get('equipmentName');
      const date = params.get('date');
      const start = minutes(params.get('startTime') || '00:00');
      const end = minutes(params.get('endTime') || '00:00');
      return !reservations.some(
        (r) =>
          r.equipmentName === name &&
          r.date === date &&
          r.status !== 'REJECTED' &&
          start < minutes(r.time) + r.duration &&
          minutes(r.time) < end,
      );
    }
    if ((m = path.match(/^\/reservations\/student\/(\d+)$/))) {
      return clone(reservations.filter((r) => r.studentId === Number(m![1])).map(reservationDto));
    }
    if (path === '/shared-tools') return clone(sharedTools);
    if ((m = path.match(/^\/shared-tools\/owner\/(\d+)$/))) {
      return clone(sharedTools.filter((t) => t.owner.studentId === Number(m![1])));
    }
    if (path === '/research') return clone(research.map(researchDto));
    if ((m = path.match(/^\/maintenance-requests\/technician\/(\d+)$/))) {
      return clone(maintenance.filter((r) => r.technicianId === Number(m![1])));
    }
    notFound(endpoint);
  },

  async post(endpoint: string, data: any): Promise<any> {
    await latency();
    if (endpoint === '/reservations') {
      const req = data as CreateReservationRequest;
      const r = {
        id: nextReservationId++,
        equipmentName: req.equipmentName,
        studentId: req.studentId,
        date: req.date,
        time: req.time,
        duration: req.duration,
        purpose: req.purpose,
        reservationType: req.reservationType,
        teamSize: req.teamSize,
        status: 'PENDING' as const,
      };
      reservations.push(r);
      return clone(reservationDto(r));
    }
    if (endpoint === '/shared-tools') {
      const req = data as CreateSharedToolRequest;
      const tool: SharedTool = {
        toolId: nextToolId++,
        toolName: req.toolName,
        description: req.description,
        imageUrl: req.imageUrl,
        owner: student(req.ownerStudentId),
        contactEmail: student(req.ownerStudentId).email,
      };
      sharedTools.push(tool);
      return clone(tool);
    }
    if (endpoint === '/equipment') {
      if (equipment.some((e) => e.equipmentName === data.equipmentName)) {
        throw new Error('Equipment with this name already exists.');
      }
      const e: StoredEquipment = {
        equipmentName: data.equipmentName,
        status: data.status || 'AVAILABLE',
        labId: data.labId,
      };
      equipment.push(e);
      return clone(equipmentDto(e));
    }
    notFound(endpoint);
  },

  async put(endpoint: string, data: any): Promise<any> {
    await latency();
    let m: RegExpMatchArray | null;
    if ((m = endpoint.match(/^\/reservations\/(\d+)\/(approve|reject)$/))) {
      const r = reservations.find((x) => x.id === Number(m![1]));
      if (!r) throw new Error('Reservation not found.');
      r.status = m[2] === 'approve' ? 'APPROVED' : 'REJECTED';
      return clone(reservationDto(r));
    }
    if ((m = endpoint.match(/^\/equipment\/(.+)\/status$/))) {
      const e = equipment.find((x) => x.equipmentName === decodeURIComponent(m![1]));
      if (!e) throw new Error('Equipment not found.');
      e.status = data.status;
      return clone(equipmentDto(e));
    }
    if ((m = endpoint.match(/^\/maintenance-requests\/(\d+)\/status$/))) {
      const r = maintenance.find((x) => x.maintenanceId === Number(m![1]));
      if (!r) throw new Error('Maintenance request not found.');
      r.status = data.status;
      return clone(r);
    }
    notFound(endpoint);
  },

  async delete(endpoint: string): Promise<void> {
    await latency();
    const [path, query = ''] = endpoint.split('?');
    const m = path.match(/^\/shared-tools\/(\d+)$/);
    if (m) {
      const owner = Number(new URLSearchParams(query).get('ownerStudentId'));
      const tool = sharedTools.find((t) => t.toolId === Number(m[1]));
      if (!tool) throw new Error('Shared tool not found.');
      if (tool.owner.studentId !== owner) throw new Error('You can only delete your own items.');
      sharedTools = sharedTools.filter((t) => t.toolId !== tool.toolId);
      return;
    }
    notFound(endpoint);
  },
};
