const { join } = require('path');

const PLUGIN = 'config';
const IDENTIFIER = 'config:';
const IDENTIFIER_COLOR = '\x1b[32m';
const COLOR_RESET = '\x1b[0m';
const DEFAULT_DIRECTORY = 'config';

class Config {
  constructor(sls, options) {
    this.serverless = sls;

    const dir = sls?.custom?.configs?.dir || DEFAULT_DIRECTORY;
    process.env.NODE_CONFIG_DIR = join(process.cwd(), dir);
    process.env.NODE_CONFIG_ENV = options?.stage || sls?.service?.provider?.stage;


    this.hooks = {
      [`${PLUGIN}:debug:debug`]: this.printDebug.bind(this),
    };

    this.commands = {
      [PLUGIN]: {
        usage: 'Inject config values in custom value',
        lifecycleEvents: [PLUGIN],
        commands: {
          debug: {
            usage: 'Display modular file(s) information',
            lifecycleEvents: ['prepare', 'debug'],
          },
        },
      },
    };

    const config = require('config');
    this._config = config;

    this.configurationVariablesSources = {
      config: {
        async resolve({ address }) {
          return {
            //
            value: config.get(address) || null
          };
        },
      },
    };
  }

  async resolveConfig(...args) {
    const [self_key] = args;
    if (self_key.includes('config')) {
      const key = self_key.replace('config:', '');
      return this.config.get(key) || null;
    }

    return await this.defaultSelfResolver(...args);
  }

  log(...args) {
    this.serverless.cli.consoleLog(
      [`${IDENTIFIER_COLOR}${IDENTIFIER}${COLOR_RESET}`, ...args].join(' '),
    );
  }

  printDebug() {
    this.log(JSON.stringify(this._config, null, 2));
  }
}

module.exports = Config;
