import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from './Login';
import { DEMO_ACCOUNTS } from '../services/demoBackend';

describe('<Login /> (demo mode)', () => {
  it.each(DEMO_ACCOUNTS)('signs in as the demo $role', async (acct) => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<Login onLogin={onLogin} onShowRegister={() => {}} />);

    const demoBox = screen.getByText(/demo mode: pick an account/i).parentElement as HTMLElement;
    await user.click(
      within(demoBox).getByRole('button', { name: new RegExp(`^${acct.role}$`, 'i') }),
    );
    expect(screen.getByLabelText(/email/i)).toHaveValue(acct.email);

    await user.click(screen.getByRole('button', { name: /sign in|log in|login/i }));
    await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1), { timeout: 4000 });
    expect(onLogin.mock.calls[0][0]).toMatchObject({ role: acct.role, email: acct.email });
  });

  it('shows an error for an unknown account and does not log in', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<Login onLogin={onLogin} onShowRegister={() => {}} />);

    await user.type(screen.getByLabelText(/email/i), 'nobody@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    await user.click(screen.getByRole('button', { name: /sign in|log in|login/i }));

    expect(await screen.findByText(/demo accounts/i, {}, { timeout: 4000 })).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
