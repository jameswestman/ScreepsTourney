#!/bin/bash

# we will need to close background processes on exit
trap 'kill $(jobs -p)' SIGINT SIGTERM

# wipe server directory
rm -r server
mkdir server

# initialize the server with the steam API key passed in through the command line
echo $1 | screeps init server

# run the setup script
npm run setup -- --location ./server --interface $2 --apikey $3

# go into the server directory
cd server

# start the server for the first time
screeps start &
serverPID=$!

# wait 5 seconds for the server to start up
sleep 5

# setup
echo 'setup()' | screeps cli &
cliPID=$!

# wait a bit
sleep 15

# restart server
kill -INT $serverPID
kill -INT $cliPID

screeps start &

sleep 5

echo 'begin()' | screeps cli
