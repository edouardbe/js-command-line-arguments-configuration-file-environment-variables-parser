import commandLineArgumentsConfigurationFileEnvironmentVariablesParser from '../main.mjs'
import assert  from 'assert';

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
describe('command line', function () {
    
    describe('boolean argument with defaultIfMissing and defaultIfPresent values', function () {
        const definitions = [
            { name: 'verbose', alias: 'v', type: Boolean, defaultIfMissing: false, defaultIfPresent: true, desc: "activate the verbose mode" }
        ]

        it('no argument should return verbose deactivated', function () {
            const options = {
                argv: []
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), false)
          });
        it('--verbose should return verbose activated', function () {
            const options = {
                argv: ['--verbose']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('--verbose=pouet should return verbose activated', function () {
            const options = {
                argv: ['--verbose=pouet']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"),true)
        });
        it('--verbose=true should return verbose activated', function () {
            const options = {
                argv: ['--verbose=true']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('--verbose=false should return verbose deactivated', function () {
            const options = {
                argv: ['--verbose=false']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), false)
        });
        it('-v should return verbose activated', function () {
            const options = {
                argv: ['-v']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"),true)
        });
        it('-v true should return verbose activated', function () {
            const options = {
                argv: ['-v', 'true']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('-v pouet should return verbose activated', function () {
            const options = {
                argv: ['-v', 'pouet']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('-v false should return verbose deactivated', function () {
            const options = {
                argv: ['-v', 'false']
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), false)
        });
    });
    
  });

  describe('configuration file', function () {
    
    describe('boolean argument with defaultIfMissing and defaultIfPresent values', function () {
        const definitions = [
            { name: 'verbose', alias: 'v', type: Boolean, defaultIfMissing: false, defaultIfPresent: true, desc: "activate the verbose mode" },
            { name: 'config-file', type: String, desc: "file with configuration"}
        ]

        it('VERBOSE=true in the config file should return verbose activated', function () {
            const options = {
                argv: ["--config-file=./test/sample_cfg.txt"],
                envVarPrefix: "",
                cfgFileArg: 'config-file'
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
          });
          it('X_VERBOSE=false in the config file should return verbose deactivated', function () {
            const options = {
                argv: ["--config-file=./test/sample_cfg.txt"],
                envVarPrefix: "X_",
                cfgFileArg: 'config-file'
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), false)
        });
        it('XX_VERBOSE=pouet in the config file should return verbose activated', function () {
            const options = {
                argv: ["--config-file=./test/sample_cfg.txt"],
                envVarPrefix: "XX_",
                cfgFileArg: 'config-file'
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('XXX_VERBOSE= in the config file should return verbose activated', function () {
            const options = {
                argv: ["--config-file=./test/sample_cfg.txt"],
                envVarPrefix: "XXX_",
                cfgFileArg: 'config-file'
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('XXXX_VERBOSE in the config file should return verbose activated', function () {
            const options = {
                argv: ["--config-file=./test/sample_cfg.txt"],
                envVarPrefix: "XXXX_",
                cfgFileArg: 'config-file'
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('XXXXX_VERBOSE missing in the config file should return verbose deactivated', function () {
            const options = {
                argv: ["--config-file=./test/sample_cfg.txt"],
                envVarPrefix: "XXXXX_",
                cfgFileArg: 'config-file'
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), false)
        });
    });
  });
describe('environment variable', function () {   
    describe('boolean argument with defaultIfMissing and defaultIfPresent values', function () {
        const definitions = [
            { name: 'verbose', alias: 'v', type: Boolean, defaultIfMissing: false, defaultIfPresent: true, desc: "activate the verbose mode" }
        ]

        it('VERBOSE=true in the config file should return verbose activated', function () {
            const options = {
                envVarPrefix: ""
            };
            process.env["VERBOSE"]="true"
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('X_VERBOSE=false in the config file should return verbose deactivated', function () {
            const options = {
                envVarPrefix: "X_"
            };
            process.env["X_VERBOSE"]="false"
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), false)
        });
        it('XX_VERBOSE=pouet in the config file should return verbose activated', function () {
            const options = {
                envVarPrefix: "XX_"
            };
            process.env["XX_VERBOSE"]="pouet"
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });
        it('XXX_VERBOSE= in the config file should return verbose activated', function () {
            const options = {
                envVarPrefix: "XXX_"
            };
            process.env["XXX_VERBOSE"]=""
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("verbose"), true)
        });  
    });
});
describe('conversion types', function () {   
    describe('number', function () {
        const definitions = [
            { name: 'port', type: Number, defaultIfMissing: 10, desc: "port" }
        ]

        it('--port=10 should return an integer of 10 for the port', function () {
            const options = {
                argv: ["--port=10"],
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("port"), 10)
        });
        it('no port arg should return an integer of 10 for the port', function () {
            const options = {
                argv: [],
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("port"), 10)
        });
    });
    describe('integer', function () {
        const definitions = [
            { name: 'port', type: 'integer', defaultIfMissing: 10, desc: "port" }
        ]

        it('--port=10 should return an integer of 10 for the port', function () {
            const options = {
                argv: ["--port=10"],
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            assert.equal(parsedArguments.get("port"), 10)
        });
    });
    describe('String', function () {
        const definitions = [
            { name: 'path', type: String }
        ]

        it('--path=./path/file.txt should return a primitive string', function () {
            const options = {
                argv: ["--path=./path/file.txt"],
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            var path = parsedArguments.get("path");
            assert.equal(typeof path, "string")
            assert.equal(path, "./path/file.txt")
        });
    });
    describe('string', function () {
        const definitions = [
            { name: 'path', type: 'string' }
        ]

        it('--path=./path/file.txt should return a primitive string', function () {
            const options = {
                argv: ["--path=./path/file.txt"],
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            var path = parsedArguments.get("path");
            assert.equal(typeof path, "string")
            assert.equal(path, "./path/file.txt")
        });
    });

    describe('csvstring', function () {
        const definitions = [
            { name: 'items', type: 'csvstring' }
        ]

        it('--items=a,b,c should return an array of strings', function () {
            const options = {
                argv: ["--items=a,b,c"],
            };
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options);
            var items = parsedArguments.get("items");
            assert.ok(Array.isArray(items))
            assert.equal(items[1], "b")
        });
    });
});
describe('no options', function () {
    describe('all is good', function () {
        const definitions = [
            { name: 'port', type: Number, defaultIfMissing: 10, desc: "port" }
        ]

        it('--port=10 should return an integer of 10 for the port', function () {
            var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions);
            assert.equal(parsedArguments.get("port"), 10)
        });
    });
    describe('all is good', function () {
        const definitions = [
            { name: 'port', type: Number, required: true, desc: "port" }
        ]

        it('should return an error because the port is required', function () {
            try {
                var parsedArguments = commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions);
            } catch (error) {
                assert.ok(error.message.indexOf("port must not be empty. Add port in the command line") > -1)
            }
            
        });
    });
});