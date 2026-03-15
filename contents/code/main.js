const WhiteList = [
    {
        caption: null,
        resourceClass: /^Minecraft/
    },
    {
        caption: null,
        resourceClass: /^steam_app_/
    },
    {
        caption: null,
        resourceClass: /^looking-glass-client$/
    }
]

const output_name = "eDP-1";

const settings = [
    {
        output: "eDP-1",
        setting: "colorProfileSource",
        disabled: "ICC",
        enabled: "sRGB"
    },
    {
        output: "eDP-1",
        setting: "scale",
        disabled: "1.5",
        enabled: "1"
    },
];

const whiteListKey = Symbol('Window is in whitelist');

function set_settings_enabled(enable) {
    if (enable == set_settings_enabled.enabled) return;

    set_settings_enabled.enabled = enable;
    let command = "";
    let first = true;
    for (const setting of settings) {
        if (first) {
            first = false;
        } else {
            command += " && ";
        }
        command += "kscreen-doctor output." +
            setting.output + "." +
            setting.setting + "." +
            (enable ? setting.enabled : setting.disabled);
    }

    console.log(command);
    callDBus("nl.dvdgiessen.dbusapplauncher", "/nl/dvdgiessen/DBusAppLauncher",
        "nl.dvdgiessen.dbusapplauncher.Exec", "Cmd", command);
}
set_settings_enabled.enabled = false;

function isWindowInWhiteList(window) {
    return WhiteList.some(({ caption, resourceClass }) =>
        (caption === null || regex.test(window.caption)) &&
        (resourceClass === null || resourceClass.test(window.resourceClass)))
}

workspace.windowActivated.connect(window => {
    if (!window) return;
    if (window[whiteListKey] === undefined) {
        if (isWindowInWhiteList(window)) {
            window[whiteListKey] = true;

            window.fullScreenChanged.connect(() => {
                if (window.active) {
                    set_settings_enabled(window.fullScreen);
                }
            });
        } else {
            window[whiteListKey] = false;
        }
    }
    /* Disable icc profile when the window is in white list and in fullscreen */
    set_settings_enabled(window[whiteListKey] && window.fullScreen);
});