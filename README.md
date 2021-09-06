
# serverless-plugin-config
Wraps the excellent npm library [config](https://www.npmjs.com/package/config) and injects it into the serverless custom object. 

![Downloads][link-download] ![Version][link-version] ![License][link-license]

![header](https://raw.githubusercontent.com/icarus-sullivan/serverless-plugin-config/master/header.png)

# Installation

```sh
npm install -D serverless-plugin-config
```
or
```sh
yarn add -D serverless-plugin-config
```

# Usage

## Plugin Dependency

In your projects serverless file, add `serverless-plugin-config` to the list of your plugins:

```yaml
plugins:
  - serverless-plugin-config
```

## Custom Declaration
The [default]((https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_config_dir)) directory for configuration is `process.cwd() + 'config'`. You can set up a specific directory by following the example below.
```yaml
custom:
  config:
    dir: settings/env
```

## Commands
##### `config debug`

Displays the configuration data resolved by the config lib. In the example [here][example], running the command will produce the following:
```sh
$ npx serverless config debug -s beta
config: {
  "domain": "api-beta.test.com"
}
```
# Changelog

**1.0.1**
- Fixing spelling issues and lifecycle events

**1.0.0**
- Initial upload 

[link-download]: https://img.shields.io/npm/dt/serverless-plugin-config
[link-version]: https://img.shields.io/npm/v/serverless-plugin-config.svg
[link-license]: https://img.shields.io/npm/l/serverless-plugin-config.svg

[glob]: https://www.npmjs.com/package/glob
[example]: https://github.com/icarus-sullivan/serverless-plugin-config/tree/master/example
