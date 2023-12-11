import {screen} from '@testing-library/react';
import {describe, it} from 'vitest';
import {Menu} from './menu';
import {render} from "@/test/testing-library-setup";

describe('Menu Component', () => {
    it('should render the menu', () => {
        render(
            <Menu />
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
    });
});
