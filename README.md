# Screeps Tourney

Do you love automation? Programming? Competition? Of course you do! The Screeps Tourney is a coding competition based around [Screeps](https://screeps.com), "the world's first MMO strategy sandbox game for programmers."

This repository is for the tourney processor. It is a mod and wrapper for the standard Screeps server. It will pull data from the tourney web interface, which is in [this repository](https://github.com/FlyingPiMonster/ScreepsTourneySite).

## Challenge Overview

Each challenge will consist of a Submission Period and a Processing Period. The Submission Period begins when the challenge is announced, and ends several weeks later. During this period, contestants may develop their code and upload it to the web interface. When the Submission Period ends, the Processing Period begins. The processor runs everybody's code, and the player who meets the winning condition of the challenge first (in the fewest ticks) wins.

The challenges are designed to cover various game mechanics and aspects of Screeps. For example, some are based on the market system, some are based on combat and others will be based on code optimization.

All code submissions are run autonomously--contestants may not modify code, memory, flags, etc. once the Processing Period begins.

## Technical Overview

The tourney software is in two parts: the processor and the web interface. The web interface is where people submit their code and view results and replays.

The processor (in this repository) downloads submissions from the web interface and runs them in the Screeps server. When it is done, it uploads results and room histories back to the web server.

It consists of a mod and a wrapper. To create and run the server, `cd` into `src` and run `./remakeServer.sh <steamApiKey> <interfaceURL>`. This will delete the current server files (if present), initialize new server files, download the challenge file and player scripts, and start the server, add the bots to the world, then restart the server.
