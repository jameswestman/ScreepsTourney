#!/bin/bash

# delete and restore the server folder
rm -rf ../server
mkdir ../server

# initialize the server
cat ../resources/steam_apikey.txt | screeps init ../server

# create a few necessary directories
mkdir ../server/playercode

# create the mods file
node ./createmodsfile.js > ../server/mods.json

# close background processes on exit
trap 'kill $(jobs -p)' SIGINT SIGTERM

# start the server!
cd ../server
screeps start &

sleep 5

# start the CLI and feed it some commands
echo 'tourney.removeDefaultBots();tourney.loadAllPlayers();' | screeps cli
