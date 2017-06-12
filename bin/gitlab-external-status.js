#!/usr/bin/env node
const ExternalStatus = require("../ExternalStatus");
const merge = require("lodash.merge");
const chalk = require("chalk");
const cli = require("commander");
cli.version(require("../package.json").version);

const name = "build-status";

function defVar(v) { return `${chalk.green("$" + v)}`; }
function defArg(a) { return `'${chalk.blue(a)}'`; }

const statuses = [ "pending", "running", "success", "failed", "canceled" ];
//const shieldStyles = [ "plastic", "flat", "flat-squared", "social" ];

cli
  .option("-n, --name", "The name of the CI stage to add")
  .option("-s, --state [str]", `The build status.  One of [${statuses.join(", ")}]  Defaults to 'success'.`)
  .option("-d, --desc, --description [str]", "The textual description of the build status.")
  .option("-u, --url [url]", "The target URL to link to.")
  .option("-p, --project [proj]", `The current project being tested.  Defaults to ${defVar("CI_PROJECT_ID")}.`,
    process.env.CI_PROJECT_ID)
  .option("-c, --commit [sha]", `The commit to add the status to.  Defaults to ${defVar("CI_COMMIT_SHA")}.`,
    process.env.CI_COMMIT_SHA)
  .option("-r, --ref [ref]",
    `The build reference.  Defaults to ${defVar("CI_COMMIT_REF_SLUG")} (GitLab defaults to 'default')`,
    process.env.CI_COMMIT_REF_SLUG);

cli
  .option("-g, --gitlab [url]",
    `The GitLab server's domain.  Strips path from any URL given.  Defaults to ${defVar("CI_PROJECT_URL")}.`,
    process.env.CI_PROJECT_URL)
  .option("-t, --token [token]",
    `The private or personal access token for GitLab authentication.  Defaults to ${defVar("GITLAB_TOKEN")}.`,
    process.env.GITLAB_TOKEN);

cli
  .command("shield")
  .description("Shortcut to create a build result referencing 'shields.io'.")
  .option("-l, --shield-label [name]",
    `The label to add on the left side of the shield.  Defaults to ${defArg("--name")}`)
  .option("--shield-status [text]", `The right-hand side of the shield.  Defaults to ${defArg("--description")}`)
  .option("--shield-color [color]", `The default background color of the shield.  Uses ${defArg("--state")} by default`)
  //.option("--shield-style [style]", `The style of the shield.  One of [${shieldStyles.join(", ")}].`)
  .action(opts => {
    const status = new ExternalStatus(cli);
    status.shield(merge({}, opts, cli));
  })
  .on("--help", () => {
    console.log(`
      Examples:

        $ ${name} shield --name 'Lint' --desc '2 Warnings, 0 Errors' --shield-color 'orange'
        $ ${name} shield --name 'Lint Status' --desc 'Lint passed with 2 warnings, 0 errors' \\
            --shield-label 'Lint' --shield-status '2 Warnings, 0 Errors' --shield-color 'orange'
    `);
  });

cli
  .on("--help", () => {
    console.log(`See ${name} [command] --help for documentation about specific commands.`);
  });


cli.parse(process.argv);
