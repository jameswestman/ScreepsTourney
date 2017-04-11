#!/bin/bash

rm -r server
mkdir server
echo "B68796EDFE0F9AD94D01BEBF27F504E0" | screeps init server
npm run setup -- --location ./server --interface "http://internalapi.lvh.me:8080" --apikey "security"
cd server
screeps start
