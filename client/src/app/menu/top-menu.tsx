import {useContext} from 'react';
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
import {ThemeContext} from '@/app/theme/theme-provider';
import {DynamicMaterialDesignIcon} from "@/app/components/dynamic-material-design-icon";
import {useTranslation} from "react-i18next";

export function TopMenu() {
    const {t} = useTranslation();
    const {setTheme, theme} = useContext(ThemeContext);

    return (
        <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
            <MenubarMenu>
                <MenubarTrigger className="font-bold">{t('home_menu')}</MenubarTrigger>
                <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger className="items-center">
                            <DynamicMaterialDesignIcon className="mr-2 h-6 w-6" iconKey="theme-light-dark"/>
                            {t('light_dark_menu')}
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarCheckboxItem
                                checked={'light' === theme}
                                disabled={'light' === theme}
                                onClick={() => setTheme('light')}
                            >
                                <DynamicMaterialDesignIcon className="mr-2 h-6 w-6" iconKey="white-balance-sunny"/>
                                {t('light_theme')}
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={'dark' === theme}
                                disabled={'dark' === theme}
                                onClick={() => setTheme('dark')}
                            >
                                <DynamicMaterialDesignIcon className="mr-2 h-6 w-6" iconKey="weather-night"/>
                                {t('dark_theme')}
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={'system' === theme}
                                disabled={'system' === theme}
                                onClick={() => setTheme('system')}
                            >
                                <DynamicMaterialDesignIcon className="mr-2 h-6 w-6" iconKey="laptop"/>
                                {t('system_theme')}
                            </MenubarCheckboxItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarItem disabled>
                        <DynamicMaterialDesignIcon className="mr-2 h-6 w-6" iconKey="cog"/>
                        {t('preferences_menu')}
                    </MenubarItem>
                    <MenubarSeparator/>
                    <MenubarItem disabled>
                        <DynamicMaterialDesignIcon className="mr-2 h-6 w-6" iconKey="info"/>
                        {t('about_menu')}
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
