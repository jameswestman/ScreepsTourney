#!/bin/bash

rm -r server
mkdir server
echo $1 | screeps init server
npm run setup -- --location ./server --interface "http://internalapi.lvh.me:8080" --apikey "security"
cd server
screeps start
