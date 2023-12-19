import { act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { TopMenu } from './top-menu';
import { render } from '@/test/testing-library-setup';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '../theme/theme-provider';

async function clickOnHomeMenu() {
    const homeButton = screen.getByRole('menuitem', { name: /home/i });
    await act(async () => {
        await userEvent.click(homeButton);
    });
}

async function findThemeSwitcherMenu() {
    return await screen.findByText('Light/Dark');
}

async function clickThemeSwitcherMenu() {
    const menuItemLightDark = await findThemeSwitcherMenu();

    await act(async () => {
        await userEvent.click(menuItemLightDark);
    });
}

describe('TopMenu', () => {
    it('check if home menu is rendered', () => {
        render(<TopMenu />);
        const menuTrigger = screen.getByRole('menuitem');
        expect(menuTrigger).toBeInTheDocument();
    });

    it('displays menu items when the Home button is clicked', async () => {
        render(<TopMenu />);
        await clickOnHomeMenu();
        const menuItemLightDark = await screen.findByText('Light/Dark');
        expect(menuItemLightDark).toBeInTheDocument();
    });

    it('should disable "Light" menu item, if it is the default', async () => {
        render(
            <ThemeProvider defaultTheme="light">
                <TopMenu />
            </ThemeProvider>,
        );
        await clickOnHomeMenu();
        await clickThemeSwitcherMenu();
        const menuItemLight = await screen.findByText('Light');
        expect(menuItemLight).toBeInTheDocument();
        expect(menuItemLight).toHaveAttribute('aria-disabled', 'true');
        expect(menuItemLight).toHaveAttribute('aria-checked', 'true');

        const menuItemDark = await screen.findByText('Dark');
        expect(menuItemDark).toBeInTheDocument();
        expect(menuItemDark).not.toHaveAttribute('aria-disabled', 'false');
        expect(menuItemDark).toHaveAttribute('aria-checked', 'false');
    });

    it('should disable "Dark" menu item, if it is the default', async () => {
        render(
            <ThemeProvider defaultTheme="dark">
                <TopMenu />
            </ThemeProvider>,
        );
        await clickOnHomeMenu();
        await clickThemeSwitcherMenu();

        const menuItemDark = await screen.findByText('Dark');
        expect(menuItemDark).toBeInTheDocument();
        expect(menuItemDark).toHaveAttribute('aria-disabled', 'true');
        expect(menuItemDark).toHaveAttribute('aria-checked', 'true');

        const menuItemLight = await screen.findByText('Light');
        expect(menuItemLight).toBeInTheDocument();
        expect(menuItemLight).not.toHaveAttribute('aria-disabled', 'false');
        expect(menuItemLight).toHaveAttribute('aria-checked', 'false');
    });

    it('should disable "Dark" menu item, if it has been clicked', async () => {
        render(
            <ThemeProvider defaultTheme="light">
                <TopMenu />
            </ThemeProvider>,
        );
        await clickOnHomeMenu();
        await clickThemeSwitcherMenu();

        const menuItemDark = await screen.findByText('Dark');
        expect(menuItemDark).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(menuItemDark);
        });
        expect(menuItemDark).toHaveAttribute('aria-disabled', 'true');
        expect(menuItemDark).toHaveAttribute('aria-checked', 'true');
    });
});
