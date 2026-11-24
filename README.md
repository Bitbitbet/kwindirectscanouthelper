# Direct Scanout Helper
## Description
A KWin script that disables color profile and scaling when specified windows are fullscreen to allow direct scanout on kwin wayland.

## Dependencies
This script assumes dbus service `nl.dvdgiessen.dbusapplauncher` for running shell command.

This script relies on `kscreen-doctor` for changing color profile source and scaling.
