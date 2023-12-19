import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DynamicIcon } from './dynamic-icon';

// Mocking the @mdi/react Icon component
vi.mock('@mdi/react', () => ({
    __esModule: true,
    default: vi.fn().mockImplementation(({ className, path, title }) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <svg className={className} data-testid="mdi-icon" title={title}>
            {path}
        </svg>
    )),
}));

// Mocking the @mdi/js module
vi.mock('@mdi/js', () => ({
    mdiCheck: 'M12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20Z',
}));

describe('DynamicIcon Component', () => {
    it('renders an icon for a valid icon key', () => {
        render(<DynamicIcon iconKey="mdiCheck" className="test-class" />);
        const icon = screen.getByTestId('mdi-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('test-class');
        expect(icon).toHaveAttribute('title', 'mdiCheck');
    });

    it('returns undefined for an invalid icon key', () => {
        const { container } = render(<DynamicIcon iconKey="invalidIcon" className="test-class" />);
        expect(container.firstChild).toBeNull();
    });
});
