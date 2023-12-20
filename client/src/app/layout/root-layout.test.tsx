import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {RootLayout} from "@/app/layout/root-layout";
import {render} from "@/test/testing-library-setup";

vi.mock('@/app/menu/top-menu', () => ({TopMenu: () => <div>TopMenu</div>}));
vi.mock('@/app/smart-home/structure/main-aspect-sidebar', () => ({
    MainAspectSidebar: () => <div>MainAspectSidebar</div>
}));
vi.mock('@/app/components/dynamic-icon', () => ({DynamicIcon: () => <div>DynamicIcon</div>}));

describe('RootLayout Component', () => {
    it('renders TopMenu and MainAspectSidebar', () => {
        render(<RootLayout>
            <div>Child Content</div>
        </RootLayout>);

        expect(screen.getByText('TopMenu')).toBeInTheDocument();
        expect(screen.getByText('MainAspectSidebar')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
