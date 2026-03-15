# Direct Scanout Helper
## Description
A KWin script that disables color profile and scaling when certain apps are fullscreen to allow direct scanout on kde plasma.

## Dependencies
This script assumes the dbus service `nl.dvdgiessen.dbusapplauncher` exists. It is used to run shell command.

This script uses `kscreen-doctor` when changing color profile source and scaling.