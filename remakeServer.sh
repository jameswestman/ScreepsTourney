#!/bin/bash

rm -r server
mkdir server
echo $1 | screeps init server
npm run setup -- --location ./server --interface $2 --apikey "security"
cd server
screeps start
