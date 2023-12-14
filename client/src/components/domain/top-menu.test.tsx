import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { render } from '@/test/testing-library-setup';
import { TopMenu } from '../domain/top-menu';

describe('Menu Component', () => {
    it('should render the menu', () => {
        render(<TopMenu />);

        expect(screen.getByText('Home')).toBeInTheDocument();
    });
});
