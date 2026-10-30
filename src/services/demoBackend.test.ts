import { beforeEach, describe, expect, it, vi } from 'vitest';
import { demoBackend, DEMO_ACCOUNTS } from './demoBackend';
import { api, DEMO_MODE, getAuthToken, removeAuthToken } from './api';

beforeEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('demo mode', () => {
  it('is enabled by the test env', () => {
    expect(DEMO_MODE).toBe(true);
  });
});

describe('login (each role)', () => {
  it.each(DEMO_ACCOUNTS)('logs in $role', async (acct) => {
    const res = await demoBackend.login(acct.email);
    expect(res.role).toBe(acct.role);
    expect(res.email).toBe(acct.email);
    expect(res.token).toBeTruthy();
  });

  it('is case/whitespace insensitive and rejects unknown users', async () => {
    await expect(demoBackend.login('  STUDENT@demo.bu.edu ')).resolves.toMatchObject({
      role: 'student',
    });
    await expect(demoBackend.login('nobody@x.edu')).rejects.toThrow(/demo accounts/i);
  });

  it('api.login stores the token and removeAuthToken clears it', async () => {
    await api.login({ email: 'student@demo.bu.edu', password: 'x' });
    expect(getAuthToken()).toBeTruthy();
    removeAuthToken();
    expect(getAuthToken()).toBeNull();
  });
});

describe('registration', () => {
  it('rejects duplicate emails', async () => {
    await expect(
      demoBackend.register('student', { name: 'Dup', email: 'student@demo.bu.edu' }),
    ).rejects.toThrow(/already exists/);
  });

  it('registers a new technician', async () => {
    const res = await demoBackend.register('technician', {
      name: 'New Tech',
      email: 'new.tech@demo.bu.edu',
      technicianId: 777,
    });
    expect(res.role).toBe('technician');
    expect(res.technicianId).toBe(777);
  });
});

describe('student flow: reservations', () => {
  const base = {
    equipmentName: 'Oscilloscope',
    studentId: 1,
    date: '2099-01-01',
    time: '10:00',
    duration: 60,
    purpose: 'test',
    reservationType: 'INDIVIDUAL',
    teamSize: 1,
  };

  it('creates a pending reservation visible to the student, then detects the conflict', async () => {
    const equipment = (await demoBackend.get('/equipment'))[0].equipmentName as string;
    const created = await demoBackend.post('/reservations', { ...base, equipmentName: equipment });
    expect(created.status).toBe('PENDING');
    const mine = await demoBackend.get('/reservations/student/1');
    expect(
      mine.some((r: { reservationId: number }) => r.reservationId === created.reservationId),
    ).toBe(true);
    const q = `/reservations/check-availability?equipmentName=${encodeURIComponent(equipment)}&date=2099-01-01&startTime=10:30&endTime=11:30`;
    expect(await demoBackend.get(q)).toBe(false);
    const free = q.replace('startTime=10:30&endTime=11:30', 'startTime=12:00&endTime=13:00');
    expect(await demoBackend.get(free)).toBe(true);
  });
});

describe('instructor flow: approval', () => {
  it('approves and rejects reservations; unknown id errors', async () => {
    const equipment = (await demoBackend.get('/equipment'))[0].equipmentName as string;
    const r = await demoBackend.post('/reservations', {
      equipmentName: equipment,
      studentId: 1,
      date: '2099-02-01',
      time: '09:00',
      duration: 30,
      purpose: 'p',
      reservationType: 'INDIVIDUAL',
      teamSize: 1,
    });
    expect((await demoBackend.put(`/reservations/${r.reservationId}/approve`, {})).status).toBe(
      'APPROVED',
    );
    expect((await demoBackend.put(`/reservations/${r.reservationId}/reject`, {})).status).toBe(
      'REJECTED',
    );
    await expect(demoBackend.put('/reservations/99999/approve', {})).rejects.toThrow(/not found/i);
  });
});

describe('technician flow: equipment + maintenance', () => {
  it('changes equipment status and lists maintenance for a technician', async () => {
    const name = (await demoBackend.get('/equipment'))[0].equipmentName as string;
    const updated = await demoBackend.put(`/equipment/${encodeURIComponent(name)}/status`, {
      status: 'MAINTENANCE',
    });
    expect(updated.status).toBe('MAINTENANCE');
    const list = await demoBackend.get('/maintenance-requests/technician/3');
    expect(Array.isArray(list)).toBe(true);
  });

  it('rejects duplicate equipment names', async () => {
    const e = (await demoBackend.get('/equipment'))[0];
    await expect(
      demoBackend.post('/equipment', { equipmentName: e.equipmentName, labId: 1 }),
    ).rejects.toThrow(/already exists/);
  });
});

describe('shared tools ownership', () => {
  it('only the owner may delete', async () => {
    const tool = await demoBackend.post('/shared-tools', {
      toolName: 'Drill',
      description: 'd',
      ownerStudentId: 1,
    });
    await expect(
      demoBackend.delete(`/shared-tools/${tool.toolId}?ownerStudentId=2`),
    ).rejects.toThrow(/only delete your own/);
    await demoBackend.delete(`/shared-tools/${tool.toolId}?ownerStudentId=1`);
    const all = await demoBackend.get('/shared-tools');
    expect(all.some((t: { toolId: number }) => t.toolId === tool.toolId)).toBe(false);
  });
});

describe('doctor flow', () => {
  it('lists research and unknown endpoints fail loudly', async () => {
    expect(Array.isArray(await demoBackend.get('/research'))).toBe(true);
    await expect(demoBackend.get('/nope')).rejects.toThrow(/no handler/);
  });
});
