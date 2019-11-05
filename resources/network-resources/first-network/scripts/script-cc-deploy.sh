#!/bin/bash

echo
echo "Install/Instantiate chaincode"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
CC_SRC_PATH="$6"
CC_NAME="$7"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="10"}
: ${LANGUAGE:="java"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=10
echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

echo "Installing chaincode on peer 0, org 1"
installChaincode 0 1
echo "Installing chaincode on peer 0, org 2"
installChaincode 0 2

echo "Instantiating chaincode on peer 0, org 1"
instantiateChaincode 0 1


# exit 0
