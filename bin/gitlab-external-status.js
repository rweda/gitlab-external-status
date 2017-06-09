#!/usr/bin/env node
const ExternalStatus = require("../ExternalStatus");

const cli = require("commander");
cli.version(require("../package.json").version);

cli.parse(process.argv);
