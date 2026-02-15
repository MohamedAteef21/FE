@echo off
REM Batch file to run PowerShell script as Administrator
REM This will request Administrator privileges automatically

echo Requesting Administrator privileges...
powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \"%~dp0push-to-github.ps1\"' -Verb RunAs"
pause

