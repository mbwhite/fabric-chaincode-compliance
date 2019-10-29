# Fabric Chaincode/Contract Compliance

This is a test tool specifically designed to test any langauge chaincode and contract implementation is complete and consistent. 

## Structure of the tool

There are a set of different 'gerkin features' that drive tests for different aspects of the implementation. 
Each of these features will use one or more Fabric infrastructures and will use one or of required set of Chaincode and Contracts.

The Fabric infrastructure is supplied as part of the tool, the Chaincode and Contracts must be specified as these are 
the elements that are under test.

## Running the tool

### Pre-reqs

- build environment setup for your chaincode language
- nodejs 10 or greater
- docker and docker-compose

### Usage

It is advised to *not* install this globally but as part of a local testing installation. 

```
npm init -y # this is the quick approach you might wish to 
npm install --save-dev @ampretia/fabric-chaincode-compliance
```

The tool can be invoked as follows

```
$(npm bin)/fcc --chaincode-dir 
```

