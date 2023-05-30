# command line arguments, configuration file and environment variables parser

A npm package to read from a definition object how to read the arguments in the command line, or expect them in a configuration file or as environment variables  

## Get Started

## test
```
# to isntall mocha and other dependencies
npm install

# to run the test
npm test
```

## create a distribution
```
npm run dist
```

## Publish to NPM
```
npm publish --dry-run
npm publish --access=public
```

## Usage 
in package.json, add the dependency
```
"dependencies": {
    "@edouardbe/command-line-arguments-configuration-file-environment-variables-parser": "^0.0.1"
    ...
},
```
then run 
````
npm install
````

In your code
````
const commandLineArgumentsConfigurationFileEnvironmentVariablesParser = require('@edouardbe/command-line-arguments-configuration-file-environment-variables-parser');

...
const definitions = [
    { name: 'verbose', alias: 'v', type: Boolean, defaultIfMissing: false, defaultIfPresent: true, desc: "activate the verbose mode" },
    { name: 'bypass-initial-test', type: Boolean, defaultIfMissing: false, defaultIfPresent: true, desc: "used to bypass the initial test" },
    { name: 'configuration-file', type: String, desc: "location of the configuration file to read more variables" },
    { name: 'output-dir', type: String, defaultIfMissing: os.tmpdir(), desc: "the output directory where temporary data will be stored"  },
    { name: 'output-file', type: String, defaultIfMissing: "fastly-real-time-api-to-prometheus.data" , desc: "the output file where temporary data will be stored"  },
    { name: 'logs-dir', type: String, defaultIfMissing: "/var/log", dirCreateIfMissing: true, desc:"the directory to write the logs"},
    { name: 'logs-file', type: String, defaultIfMissing: "fastly-real-time-api-to-prometheus.log" , desc:"the file to write the logs" },
    { name: 'nodejs-port', type: Number, defaultIfMissing: 9145, required: true, desc:"the port to listen to" },
    { name: 'nodejs-path', type: String, defaultIfMissing: "/metrics", required: true,desc:"the path to listen to"},
    { name: 'bash-script-location', type: String , defaultIfMissing: "../fastly-real-time-api-to-prometheus.sh", required: true, fileMustExist: true, desc:"the location of the bach script" },
    { name: 'fastly-key', type: String, obfuscate: true, required: true, desc:"the Fastly api key to authenticate to Fastly"},
    { name: 'fastly-service-id', type: String, obfuscate: true, required: true, desc:"the Fastly service id to get the real-data"},
    { name: 'ignore-metrics', type: String, desc:"semi-column separated values of metrics to ignore"}
  ]

const options = {
    envVarPrefix: "FRTATP_",
    cfgFileArg: 'configuration-file'
}

const parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            

...
// to get the value computed
var logDir = parsedArguments.get("logs-dir")

// verbose options
parsedArguments.getValuesAndSource().forEach(o => {
    verbose(`option ${o.name} is ${o.value} from ${o.from}`)
});

// to get the value from the command line (not config file or environment variable)
var verbose = parsedArguments.getFromCommandLine("verbose")
````

