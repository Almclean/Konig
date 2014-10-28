@echo off
:: =========================================================
::
:: Basic controller for the Windows Neo4j Server.
:: The server is run as a Windows service, called  Neo4j-Server, this script will allow us to:
::  1) Check the status of the server
::  2) Start the server
::  3) Stop the server
::  4) Restart the server
::
:: =========================================================

:: =========================================================
::
:: Set the global env variables for the script
::
:: =========================================================
setlocal ENABLEEXTENSIONS
set serviceName=Neo4j-Server

:: =========================================================
::
:: Call the main function with the parameter passed in
::
:: =========================================================
goto :main %1

:: =========================================================
::
:: Call sc query on Neo4j-Server and parse out the value
::
:: =========================================================
:getStatus
  set status=""
  :: Get the state line from the sc output
  for /F "tokens=1,2 delims=:" %%a in ('sc query %serviceName%^|findstr "STATE"') do set status=%%b
  :: Remove ALL space, concatenating the numerical and the string
  set status=%status: =%
  :: Parse the text
  if "%status%" == "4RUNNING" (
    set status="RUNNING"
  ) else if "%status%" == "1STOPPED" (
    set status="STOPPED"
  ) else (
    set status="NOT INSTALLED"
  )
  goto:eof

:: =========================================================
::
:: Print the status of the service
::
:: =========================================================
:status
  call :getStatus
  echo %status%
  goto :eof

:: =========================================================
::
:: Start the service
::  - If this is not installed we won't proceed here
::  - If this is already in a RUNNING state we'll do nothing
::
:: =========================================================
:start
  call :getStatus
  if %status% == "NOT INSTALLED" (
    call:console
  ) else if %status% == "RUNNING" (
    echo Service is already running, no action taken
  ) else (
    sc start %serviceName%
  )
  goto :eof

:: =========================================================
::
:: Call sc stop on the service
::
:: =========================================================
:stop
  sc stop %serviceName%
  goto:eof

:: =========================================================
::
:: Restart the service by calling stop and then start
::
:: =========================================================
:restart
  call :stop
  call :start
  goto :eof

:: =========================================================
::
:: Echo the Usage of this script
::
:: =========================================================
:usage
  echo Usage: %~0Neo4jInstaller.bat <status|stop|start|restart>
  goto:eof

:: =========================================================
::
:: The "main" function
::
:: =========================================================
:main
  if "%1" == "" goto :usage
  if "%1" == "stop" goto :stop
  if "%1" == "start" goto :start
  if "%1" == "status" goto :status
  if "%1" == "restart" goto :restart
  call :usage
  goto :eof


::end function remove