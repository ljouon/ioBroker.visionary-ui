import React from 'react';
import { withStyles } from '@mui/styles';
import { CreateCSSProperties } from '@mui/styles/withStyles';
import I18n from '@iobroker/adapter-react-v5/i18n';
import {
    Avatar,
    Box,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Input,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { MapsHomeWork } from '@mui/icons-material';

const styles = (): Record<string, CreateCSSProperties> => ({
    input: {
        marginTop: 0,
        minWidth: 400,
    },
    button: {
        marginRight: 20,
    },
    card: {
        maxWidth: 345,
        textAlign: 'center',
    },
    media: {
        height: 180,
    },
    column: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: 20,
    },
    columnLogo: {
        width: 350,
        marginRight: 0,
    },
    columnSettings: {
        width: 'calc(100% - 370px)',
    },
    controlElement: {
        //background: "#d2d2d2",
        marginBottom: 5,
    },
});

interface SettingsProps {
    classes: Record<string, string>;
    native: Record<string, any>;

    onChange: (attr: string, value: any) => void;
}

interface SettingsState {
    // add your state properties here
    dummy?: undefined;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
    constructor(props: SettingsProps) {
        super(props);
        this.state = {};
    }

    renderInput(title: AdminWord, attr: string, type: string, disabled: boolean, value?: string) {
        return (
            <TextField
                label={I18n.t(title)}
                className={`${this.props.classes.input} ${this.props.classes.controlElement}`}
                value={value ? value : this.props.native[attr]}
                type={type || 'text'}
                onChange={(e) => this.props.onChange(attr, e.target.value)}
                margin="normal"
                variant={'outlined'}
                disabled={disabled}
            />
        );
    }

    renderSelect(
        title: AdminWord,
        attr: string,
        options: { value: string; title: AdminWord }[],
        style?: React.CSSProperties,
    ) {
        return (
            <FormControl
                className={`${this.props.classes.input} ${this.props.classes.controlElement}`}
                style={{
                    paddingTop: 5,
                    ...style,
                }}
                variant="standard"
            >
                <Select
                    value={this.props.native[attr] || '_'}
                    onChange={(e) => this.props.onChange(attr, e.target.value === '_' ? '' : e.target.value)}
                    input={<Input name={attr} id={attr + '-helper'} />}
                >
                    {options.map((item) => (
                        <MenuItem key={'key-' + item.value} value={item.value || '_'}>
                            {I18n.t(item.title)}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{I18n.t(title)}</FormHelperText>
            </FormControl>
        );
    }

    renderCheckbox(title: AdminWord, attr: string, style?: React.CSSProperties) {
        return (
            <FormControlLabel
                key={attr}
                style={{
                    paddingTop: 5,
                    ...style,
                }}
                className={this.props.classes.controlElement}
                control={
                    <Checkbox
                        checked={this.props.native[attr]}
                        onChange={() => this.props.onChange(attr, !this.props.native[attr])}
                        color="primary"
                    />
                }
                label={I18n.t(title)}
            />
        );
    }

    render() {
        return (
            <form className={this.props.classes.tab}>
                <Container component="main" maxWidth="xs">
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <MapsHomeWork />
                    </Avatar>
                    <Typography component="h1" variant="h6">
                        {I18n.t('visionaryUiSettings')}
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                {this.renderInput('webPort', 'webPort', 'number', false)}
                                <Typography variant={'body1'}>{I18n.t('webPortDescription')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={'body1'}>{I18n.t('socketPortDescription')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={'h6'}>{I18n.t('descriptionTitle')}</Typography>
                                <Typography variant={'body1'}>{I18n.t('descriptionContent')}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </form>
        );
    }
}

export default withStyles(styles)(Settings);
