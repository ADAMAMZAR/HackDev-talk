@echo off
title Vibe Coding Safely demos
rem Double-click to start every demo and open them in talk order.
rem Close this window to stop all the demo servers.
node "%~dp0demos\run-all.mjs" %*
pause
