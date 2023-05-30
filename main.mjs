import fs from 'fs'

function commandLineArgumentsConfigurationFileEnvironmentVariablesParser(definitions, options ) {
  
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    
    class ParsedArguments {
    
        constructor(in_definitions,in_options = {}) {
            this.arguments = {};
            this.errors = [];
            this.envVarPrefix = in_options.envVarPrefix;
            this.cfgFileArg = in_options.cfgFileArg;

            var argv = in_options.argv || process.argv.slice(2)

            // transform all the -alias into --name
            argv = argv.map( (a,i,s) => {
                if ( a.startsWith("-") && !a.startsWith("--")) {
                    var alias = a.slice(1)
                    var def = in_definitions.find(d => d.alias == alias)
                    if (def == null ) {
                        this.errors.push(`unknow alias ${alias}`) 
                    } else {
                        var next = s[i+1]
                        if (this.hasValue(next) && !next.startsWith("-")) {
                            return `--${def.name}=${next}`
                        } else {
                            return `--${def.name}`
                        }
                    }
                } else if (a.startsWith("--") ) {
                    return a
                } else {
                    return null
                }
            }).filter(a => a != null)
            
            // read the environment variables
            in_definitions.forEach(d => {
                this.arguments[d.name] = {};
                this.arguments[d.name].def = d;
                if ( this.hasValue(this.envVarPrefix) ) {
                    var l_envValue = process.env[this.toEnvVarName(d.name)];
                    if (this.hasValue(l_envValue) ) {
                        if ( l_envValue.length > 0) {
                            this.arguments[d.name].env = this.cast(l_envValue, d.type); 
                        }
                        this.arguments[d.name].in_env = true
                    }
                } 
            },this);
    

            // read the command line
            argv.forEach(a => {
                // split key value
                var [k,v] = a.slice(2).split("=")
                // get the definition by the key
                var l_arg = this.arguments[k]
                if ( l_arg == null) {
                    this.errors.push(`argument ${a} is not expected`) 
                } else {
                    if ( v != null ) {
                        l_arg.cl = this.cast( v, l_arg.def.type)
                        l_arg.in_cl = true
                    } else if (this.hasValue(l_arg.def.defaultIfPresent)) {
                        l_arg.defaultIfPresent = this.cast( l_arg.def.defaultIfPresent, l_arg.def.type)
                        l_arg.in_cl = true
                    } else {
                        this.errors.push(`argument ${a} is used but missing value and no default value if present`) 
                    }
                }
            } )
            

            // read the configuration file options if present
            var configuration_file = this.cfgFileArg ? this.get(this.cfgFileArg) : null
            if (configuration_file != null) {
                if (!configuration_file.startsWith("/")) {
                    configuration_file = `${process.cwd()}/${configuration_file}`
                }
                if(fs.existsSync(configuration_file) == false ) {
                    throw new Error(`configuration file not found: ${configuration_file}`);  
                }
                fs.readFileSync(configuration_file).toString().split(/\r?\n/)
                    .filter( line => !line.startsWith("#") && line.match(`\\b(^${this.envVarPrefix || "" }[A-Z0-9_]+)\\b`, 'g') != null)
                    .forEach(line =>  {
                        var [key,value] = line.split("=")
                        var l_argkey = this.toArgName(key)
                        var l_arg = this.arguments[l_argkey];
                        if (l_arg != null) {
                            if ( value != null && value.length > 0) {
                                l_arg.cf = this.cast( value, l_arg.def.type); 
                            }
                            l_arg.in_cf = true
                        }
                    }, this);
            }
    
            Object.entries(this.arguments).forEach( ([key,obj]) => {
                var value = this.get(key)
                if ( obj.def.dirCreateIfMissing === true && this.mustNotBeEmpty(key)) {
                    if (!fs.existsSync(value)) {
                        fs.mkdirSync(value);
                    } 
                }
                if ( obj.def.required == true ) {
                    this.mustNotBeEmpty(key) 
                }
                if ( obj.def.fileMustExist === true && this.mustNotBeEmpty(key)) {
                    this.mustFileExit(key)  
                }
            });
    
            if (this.errors.length > 0) {
                throw new Error( "\r\n - " + this.errors.join("\r\n - ") + "\r\n");  
            }
    
        }
    
        toEnvVarName(in_key) {
            return `${this.envVarPrefix}${in_key.toUpperCase().replaceAll("-","_")}`
        }
        toArgName(in_key) {
            return in_key.replace(this.envVarPrefix,"").replaceAll("_","-").toLowerCase()
        }
    
        mustNotBeEmpty(in_key) {
            var value = this.get(in_key);
            if ( value == null) {
                if (this.envVarPrefix !== undefined) {
                    this.errors.push(`${in_key} must not be empty. Set ${this.toEnvVarName(in_key)} in the configuration file or environment variable or add ${in_key} in the command line`);
                } else {
                    this.errors.push(`${in_key} must not be empty. Add ${in_key} in the command line`);
                }
                return false
            }
            return true
        }
        mustFileExit(in_key) {
            var file = this.get(in_key)
            if ( file == null || fs.existsSync(file ) == false ) {
                this.errors.push(`${in_key} ${file} does not exist.`) 
            }
        }
    
        get(in_key) {
            var obj = this.arguments[in_key];
            return this.hasValue(obj.cl) ? obj.cl : (this.hasValue(obj.cf) ? obj.cf : (this.hasValue(obj.env) ? obj.env : ( (obj.in_env || obj.in_cf || obj.in_cl) && (this.hasValue(obj.def.defaultIfPresent))? obj.def.defaultIfPresent : (this.hasValue(obj.def.defaultIfMissing) ? obj.def.defaultIfMissing :  null))) ) ;
        }
    
        getFromCommandLine(in_key) {
            var obj = this.arguments[in_key];
            return obj["cl"];
        }
    
        hasValue(in_value) {
            return in_value != null && in_value != undefined
        }
    
        takenFrom(in_key) {
            var obj = this.arguments[in_key];
            return this.hasValue(obj.cl) ? "command line" : (this.hasValue(obj.cf) ? "configuration file" : (this.hasValue(obj.env) ? "environment variable" : ( obj.in_cl && (this.hasValue(obj.def.defaultIfPresent))? "default value when argument is present" :  (this.hasValue(obj.def.defaultIfMissing) ? "default value when argument is missing" :  "nowhere"))) ) ;
        }
        
        getValuesAndSource() {
           return Object.entries(this.arguments).map( ([key,obj]) => {
                return {
                    name : key,
                    value : obj.def.obfuscate == true ? "****" : this.get(key),
                    from : this.takenFrom(key)
                }
            }, this)
        }
        
        cast(in_value, in_type) {
            switch (in_type) {
                case Boolean:
                case 'boolean':
                    return in_value == "false" ? false :  new Boolean(in_value)
                case Number:
                case 'number':
                    return new Number(in_value)
                case 'integer':
                    return parseInt(in_value)
                case String:
                case 'string':
                    return new String(in_value).toString()
                case 'csvstring':
                    return new String(in_value).toString().split(",")
                default:
                    return in_value
            }
        }
    }

    return new ParsedArguments(definitions,options)
}

export default commandLineArgumentsConfigurationFileEnvironmentVariablesParser;
