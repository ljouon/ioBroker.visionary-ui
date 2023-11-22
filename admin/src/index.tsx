import React from 'react';
import ReactDOM from 'react-dom';
import Utils from '@iobroker/adapter-react-v5/Components/Utils';
import App from './app';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';

import theme from '@iobroker/adapter-react-v5/Theme';

let themeName = Utils.getThemeName();

function build(): void {
    ReactDOM.render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(themeName)}>
                <App
                    adapterName="visionary-ui"
                    onThemeChange={(_theme) => {
                        themeName = _theme;
                        build();
                    }}
                />
            </ThemeProvider>
        </StyledEngineProvider>,
        document.getElementById('root'),
    );
}

build();
