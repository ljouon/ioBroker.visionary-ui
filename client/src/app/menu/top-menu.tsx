import { useContext } from 'react';
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/__generated__/components/menubar';
import { ThemeContext } from '@/app/theme/theme-provider';
import { DynamicIcon } from '@/app/dynamic-icon';

export function TopMenu() {
    const { setTheme, theme } = useContext(ThemeContext);

    return (
        <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
            <MenubarMenu>
                <MenubarTrigger className="font-bold">Home</MenubarTrigger>
                <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger className="items-center">
                            <DynamicIcon className="mr-2 h-6 w-6" iconKey="theme-light-dark" />
                            Light/Dark
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarCheckboxItem
                                checked={'light' === theme}
                                disabled={'light' === theme}
                                onClick={() => setTheme('light')}
                            >
                                <DynamicIcon className="mr-2 h-6 w-6" iconKey="white-balance-sunny" />
                                Light
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={'dark' === theme}
                                disabled={'dark' === theme}
                                onClick={() => setTheme('dark')}
                            >
                                <DynamicIcon className="mr-2 h-6 w-6" iconKey="weather-night" />
                                Dark
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={'system' === theme}
                                disabled={'system' === theme}
                                onClick={() => setTheme('system')}
                            >
                                <DynamicIcon className="mr-2 h-6 w-6" iconKey="laptop" />
                                System
                            </MenubarCheckboxItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarItem disabled>
                        <DynamicIcon className="mr-2 h-6 w-6" iconKey="cog" />
                        Preferences ...{' '}
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled>
                        <DynamicIcon className="mr-2 h-6 w-6" iconKey="info" />
                        About
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
