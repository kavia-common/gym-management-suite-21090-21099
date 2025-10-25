#!/bin/bash
cd /home/kavia/workspace/code-generation/gym-management-suite-21090-21099/gym_manager_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

