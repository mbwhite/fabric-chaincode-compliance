# Fabric Chaincode/Contract Compliance

This is a test tool specifically designed to test any langauge chaincode and contract implementation is complete and consistent. 

## Structure of the tool

There are 'profiles' of different cucumber features that drive tests for different aspects of the implementation. 

Each of these features will use one or more Fabric infrastructures and will use one (or more) of required set of Contracts.
The specification of the API of these contracts will be supplied. With a correctly implemented contract to the API specification, and a correctly implemented contract runtime the tests will pass.

This assertion can be made because from the perspective of a client application invoking a contract the language it is written in is irrelevent, and not-detectable.

The Fabric infrastructure is supplied as part of the tool, the Chaincode and Contracts must be specified as these are 
the elements that are under test.

To run the tool, install it locally into a local directory; it's an NPM tool. The tool then needs to be told

- the profile name of the tests that need to be run
- the location of the implemented contracts required for that profile
  a `cc.json` file in this directory should be used to precisely define the location of each

The tool will then start the required Fabric infrastructure based on the profile, and startup the required contracts; the cucumber tests are then run as required.

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

❯ $(npm bin)/fcc --help
Options:
  --version            Show version number                             [boolean]
  --chaincode-dir, -d  Directory with chaincodes             [string] [required]
  --profile, -p        Which of the inbuilt test profiles to run
                                                 [string] [default: ["default"]]
  --features           Alternative set of feature files to use, array of globs
                                                                         [array]
  --verbose            Set logging level
                                    [choices: "info", "debug"] [default: "info"]
  --help               Show help                                       [boolean]

Thank for your compliance

```

The minimum that is needed is to specify the location of the directory that has ready to go contracts
Note that the directory name must match the name of the contract in the feature.

### Contributors

This is a mono-repo maintained using rush; there are two npm modules built from this repo. 

To update (and install if nedded) all dependencies
```
rush update
```

To build
```
rush rebuild
```

To create tgz files for local testing
```
rush publish --include-all --pack --release-folder $(pwd)/tgz --publish
```

#### Directory structure

`common` contains rush configuration
`generator` the npm module to provide a yeoman generator for creating a template project that has information on set of chaincodes for testing
`resources/features` contains the cucumber features for different aspects of tests
`resources/network-resources` contains the Fabric infrastructure scripts
`runtime` the npm module that provids the overall runtime
