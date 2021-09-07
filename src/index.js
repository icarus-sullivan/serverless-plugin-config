const { join } = require('path');

const PLUGIN = 'config';
const IDENTIFIER = 'config:';
const IDENTIFIER_COLOR = '\x1b[32m';
const COLOR_RESET = '\x1b[0m';
const DEFAULT_DIRECTORY = 'config';

const SELF_RESOLVE_IDENTIFIER = 'self';
class Config {
  constructor(sls, options) {
    this.serverless = sls;

    const dir = sls?.custom?.configs?.dir || DEFAULT_DIRECTORY;
    const currentConfig = this.serverless?.service?.custom || {};
    process.env.NODE_CONFIG_DIR = join(process.cwd(), dir);
    process.env.NODE_CONFIG_ENV = options?.stage || sls?.service?.provider?.stage;

    this.config = require('config');
    this.serverless.service.custom = Object.assign(currentConfig, this.config);

    const selfResolveIndex = sls.variables.variableResolvers.findIndex((it) => it.regex.toString().includes(SELF_RESOLVE_IDENTIFIER));

    this.defaultSelfResolver = sls.variables.variableResolvers[selfResolveIndex].resolver;
    this.serverless.variables.variableResolvers[selfResolveIndex].resolver = this.resolveConfig.bind(this);

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
  }

  async resolveConfig(...args) {
    console.log('args', ...args);
    const [self_key] = args;

    if (self_key.includes('config')) {
      const key = self_key.replace('self:config.', '');
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
    const custom = this.serverless?.service?.custom || {};
    this.log(JSON.stringify(custom, null, 2));
  }
}

module.exports = Config;
