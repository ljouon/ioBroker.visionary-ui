import Icon from '@mui/material/Icon';
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
import { ThemeContext } from '@/components/theme-provider';

export function TopMenu() {
    const { setTheme, theme } = useContext(ThemeContext);

    return (
        <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
            <MenubarMenu>
                <MenubarTrigger className="font-bold">Home</MenubarTrigger>
                <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger className="items-center">Light/Dark Mode</MenubarSubTrigger>
                        <MenubarSubContent className="w-[230px]">
                            <MenubarCheckboxItem
                                checked={'light' === theme}
                                disabled={'light' === theme}
                                onClick={() => setTheme('light')}
                            >
                                <Icon className="mr-2" sx={{ fontSize: 18 }}>
                                    light_mode
                                </Icon>
                                Light
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={'dark' === theme}
                                disabled={'dark' === theme}
                                onClick={() => setTheme('dark')}
                            >
                                <Icon className="mr-2" sx={{ fontSize: 18 }}>
                                    dark_mode
                                </Icon>
                                Dark
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={'system' === theme}
                                disabled={'system' === theme}
                                onClick={() => setTheme('system')}
                            >
                                <Icon className="mr-2" sx={{ fontSize: 18 }}>
                                    computer
                                </Icon>
                                System
                            </MenubarCheckboxItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem disabled>Preferences ... </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled>About</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
