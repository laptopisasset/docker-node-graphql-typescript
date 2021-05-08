#!/bin/bash
if [ $1 == "up" ]; then
    docker compose -f docker-compose.dev.yml up --build -d
fi

if [ $1 == "down" ]; then
    docker compose -f docker-compose.dev.yml down --rmi all -v --remove-orphans
fi
