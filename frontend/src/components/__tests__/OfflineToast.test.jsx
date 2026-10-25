import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OfflineToast from '../ui/OfflineToast.jsx';

describe('OfflineToast Component', () => {
  it('should render offline warning and local storage indicator', () => {
    const onClose = vi.fn();
    render(<OfflineToast onClose={onClose} />);

    expect(screen.getByText('Backend Server Offline')).toBeInTheDocument();
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
    expect(screen.getByText('Local Storage Active')).toBeInTheDocument();
  });

  it('should call onClose callback when close button is clicked', () => {
    const onClose = vi.fn();
    render(<OfflineToast onClose={onClose} />);

    const closeBtn = screen.getByRole('button', { name: /dismiss for this session/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
