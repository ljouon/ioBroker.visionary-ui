import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const FALLBACK_LANGUAGE_KEY = 'de';

const resources = {
    en: {
        translation: {
            refresh_page: 'Refresh page',
            no_connection_to_server: 'No connection to server',
            element_not_found_navigate_back: 'Element not found, please navigate back...',
            rooms: 'Rooms',
            functions: 'Functions',
            menu: 'Menu',
            all: 'All',
            light_dark_menu: 'Light/Dark',
            preferences_menu: 'Preferences ...',
            about_menu: 'About',
            light_theme: 'Light',
            dark_theme: 'Dark',
            system_theme: 'System',
            home_menu: 'Home',
            accept: 'Accept',
        },
    },
    de: {
        translation: {
            refresh_page: 'Seite neu laden',
            no_connection_to_server: 'Keine Verbindung zum Server',
            element_not_found_navigate_back:
                'Element konnte nicht gefunden werden, bitte navigiere zu einer anderen Seite',
            rooms: 'Räume',
            functions: 'Funktionen',
            menu: 'Menü',
            all: 'Alle',
            light_dark_menu: 'Hell/Dunkel',
            preferences_menu: 'Einstellungen ...',
            about_menu: 'Über',
            light_theme: 'Hell',
            dark_theme: 'Dunkel',
            system_theme: 'System',
            home_menu: 'Zuhause',
            accept: 'Übernehmen',
        },
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: FALLBACK_LANGUAGE_KEY,
        load: 'languageOnly', // prevent loading of non-existent en-US.json
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
