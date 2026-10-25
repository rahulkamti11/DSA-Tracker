import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShortcutDialog from '../dialogs/ShortcutDialog.jsx';

describe('ShortcutDialog Component', () => {
  it('should not render anything when open is false', () => {
    const { container } = render(<ShortcutDialog open={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render all keyboard shortcut descriptions when open is true', () => {
    render(<ShortcutDialog open={true} onClose={() => {}} />);

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Add Problem Modal')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Go to Problem Log')).toBeInTheDocument();
    expect(screen.getByText('Close any Modal')).toBeInTheDocument();
  });

  it('should invoke onClose callback when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ShortcutDialog open={true} onClose={onClose} />);

    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
