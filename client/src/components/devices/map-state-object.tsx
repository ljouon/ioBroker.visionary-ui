import { StateObjectSwitch } from '@/components/devices/state-object-switch';
import { StateObjectSlider } from '@/components/devices/state-object-slider';
import { StateObjectSelect } from '@/components/devices/state-object-select';
import { StateObjectUnknown } from '@/components/devices/state-object-unknown';
import { StateObject } from '@/domain/aspect';

// const switchable = ['boolean'];
// const possibleDataTypes = ['array', 'boolean', 'file', 'json', 'mixed', 'number', 'object', 'string'];

/*
brightness:

    "_id": "hue.0.Rund-und-bunt.bri",
    "type": "state",
    "common": {
        "type": "number",
        "name": "Rund-und-bunt.bri",
        "read": true,
        "write": true,
        "role": "level.dimmer",
        "min": 0,
        "max": 254,
        "def": 0
    },
 */

/*
enum:

  "type": "state",
  "common": {
    "def": 0,
    "type": "number",
    "read": true,
    "write": false,
    "min": 0,
    "max": 1,
    "states": {
      "0": "STABLE",
      "1": "NOT_STABLE"
    },
    "name": "Dachstudio-Licht:1.PROCESS",
    "role": ""
  },
  "native": {
    "MIN": "STABLE",
    "OPERATIONS": 5,
    "MAX": "NOT_STABLE",
    "FLAGS": 1,
    "ID": "PROCESS",
    "TYPE": "ENUM",
    "DEFAULT": "STABLE",
    "VALUE_LIST": [
      "STABLE",
      "NOT_STABLE"
    ]
  },

    "type": "state",
  "common": {
    "def": 1,
    "type": "number",
    "read": true,
    "write": true,
    "min": 1,
    "max": 3,
    "name": "Bad-Thermostat:1.ACTIVE_PROFILE",
    "role": "",
    "states": {
      "1": "Standard",
      "2": "Abwesend",
      "3": "Dauerhaft"
    }
  },
    "native": {
    "MIN": 1,
    "OPERATIONS": 7,
    "MAX": 6,
    "FLAGS": 1,
    "ID": "ACTIVE_PROFILE",
    "TYPE": "INTEGER",
    "DEFAULT": 1,
    "CONTROL": "HEATING_CONTROL_HMIP.ACTIVE_PROFILE"
  },
  "_id": "hm-rpc.0.000C98A98C4C9E.1.ACTIVE_PROFILE",
  "def": "Standard",
  "role": "indicator",
  "states": {
    "1": "Standard",
    "2": "Abwesend",
    "3": "Dauerhaft"
  },
---------------------------------
ALARM
    "type": "state",
  "common": {
    "name": "Flur-1-Rauchmelder:1.ERROR_DEGRADED_CHAMBER_ALARM",
    "type": "number",
    "role": "indicator.alarm",
    "read": true,
    "write": true,
    "def": 0,
    "states": {
      "0": "NO ALARM",
      "1": "ALARM",
      "2": "ACKNOWLEDGED"
    }
  },
  "native": {
    "Name": "Flur-1-Rauchmelder:1.ERROR_DEGRADED_CHAMBER_ALARM",
    "TypeName": "ALARM",
    "DP": "16441"
  },
----------------------------------
INDICATOR

  "type": "state",
  "common": {
    "def": 0,
    "type": "number",
    "read": false,
    "write": true,
    "min": 0,
    "max": 3,
    "role": "indicator",
    "name": "Flur-Thermostat:1.CONTROL_MODE",
  },
  "native": {
    "MIN": 0,
    "OPERATIONS": 2,
    "MAX": 3,
    "FLAGS": 1,
    "ID": "CONTROL_MODE",
    "TYPE": "INTEGER",
    "DEFAULT": 0,
    "CONTROL": "HEATING_CONTROL_HMIP.CONTROL_MODE"
  },
  "_id": "hm-rpc.0.000C98A98C4BF8.1.CONTROL_MODE",

-------------------------------
Illumination lichtsensor

  "type": "state",
  "common": {
    "name": "Lichtsensor:1.AVERAGE_ILLUMINATION",
    "role": "",
    "def": 0,
    "type": "number",
    "read": true,
    "write": false,
    "min": 0,
    "max": 163830,
    "unit": "Lux"
  },
  "native": {
    "MIN": 0,
    "UNIT": "Lux",
    "OPERATIONS": 5,
    "MAX": 163830,
    "FLAGS": 1,
    "ID": "AVERAGE_ILLUMINATION",
    "TYPE": "FLOAT",
    "DEFAULT": 0,
    "CONTROL": "BRIGHTNESS_TRANSMITTER.AVERAGE_ILLUMINATION"
  },


 */

function shouldBeSwitch(uiStateObject: StateObject) {
    return 'boolean' === uiStateObject.datatype;
}

function shouldBeSlider(uiStateObject: StateObject) {
    if ('number' === uiStateObject.datatype) {
        if (!uiStateObject.states) {
            return true;
        }
    }
    return false;
}

function shouldBeSelect(uiStateObject: StateObject) {
    if ('number' === uiStateObject.datatype) {
        if (uiStateObject.states) {
            return true;
        }
    }
    return false;
}

export function mapToStateObjectComponent(sectionId: string, cardId: string, uiStateObject: StateObject) {
    console.log(uiStateObject.id, uiStateObject.role, uiStateObject.datatype);

    if (shouldBeSwitch(uiStateObject)) {
        return (
            <StateObjectSwitch
                key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                uiStateObject={uiStateObject}
                sectionId={sectionId}
                cardId={cardId}
            />
        );
    }

    if (shouldBeSlider(uiStateObject)) {
        return (
            <StateObjectSlider
                key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                uiStateObject={uiStateObject}
                sectionId={sectionId}
                cardId={cardId}
            />
        );
    }

    if (shouldBeSelect(uiStateObject)) {
        return (
            <StateObjectSelect
                key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                uiStateObject={uiStateObject}
                sectionId={sectionId}
                cardId={cardId}
            />
        );
    }

    return (
        <StateObjectUnknown
            key={sectionId + '-' + cardId + '-' + uiStateObject.id}
            uiStateObject={uiStateObject}
            sectionId={sectionId}
            cardId={cardId}
        />
    );
}
