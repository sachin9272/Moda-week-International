@echo off
echo Starting High-Fashion Concierge Bot Backend...
call venv\Scripts\activate.bat
rasa run -m models --enable-api --cors "*" --port 5005
