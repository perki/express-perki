#!/bin/bash
set -e

# Sets up the dev environment on a MacOS or GNU/Linux system

# working dir fix
SCRIPT_FOLDER=$(cd $(dirname "$0"); pwd)
cd $SCRIPT_FOLDER/../storage-migrations
npx sequelize-cli db:migrate