const WhiteList = [
    {
        caption: null,
        resourceClass: /^looking-glass-client$/,
        disabledSettings: ["scaling"]
    }
]

const settings = {
    "color_profile": {
        output: "eDP-1",
        setting: "colorProfileSource",
        whenDisabled: "ICC",
        whenEnabled: "sRGB",
        enabled: false
    },
    "scaling": {
        output: "eDP-1",
        setting: "scale",
        whenDisabled: "1.5",
        whenEnabled: "1",
        enabled: false
    },
};

const whiteListKey = Symbol('On Window Object; whitelist entry');

function set_settings_enabled(enable, disabledSettings) {
    let command = "";
    let first = true;
    for (const setting in settings) {
        const doEnable = enable && !disabledSettings.includes(setting);
        if (doEnable == settings[setting].enabled)
            continue;
        settings[setting].enabled = doEnable;

        if (first) {
            first = false;
        } else {
            command += " && ";
        }

        command += "kscreen-doctor output." +
            settings[setting].output + "." +
            settings[setting].setting + "." +
            (doEnable ? settings[setting].whenEnabled : settings[setting].whenDisabled);
    }

    if (command) {
        // console.log("[DSH] Running: " + command)
        callDBus("nl.dvdgiessen.dbusapplauncher", "/nl/dvdgiessen/DBusAppLauncher",
            "nl.dvdgiessen.dbusapplauncher.Exec", "Cmd", command);
    }
}

function findWhiteListEntry(window) {
    return WhiteList.find(({ caption, resourceClass }) =>
        (caption === null || regex.test(window.caption)) &&
        (resourceClass === null || resourceClass.test(window.resourceClass)));
}

workspace.windowActivated.connect(window => {
    if (!window) return;

    if (window[whiteListKey] === undefined) {
        let whiteListEntry = findWhiteListEntry(window);

        if (whiteListEntry) {
            window[whiteListKey] = whiteListEntry;

            window.fullScreenChanged.connect(() => {
                if (window.active) {
                    set_settings_enabled(window.fullScreen, window[whiteListKey].disabledSettings);
                }
            });
        } else {
            window[whiteListKey] = null;
        }
    }

    /* Now window[whiteListKey] will either be null or a white list entry */

    if (window[whiteListKey] === null) {
        set_settings_enabled(false, []);
    } else {
        set_settings_enabled(window.fullScreen, window[whiteListKey].disabledSettings);
    }
});
