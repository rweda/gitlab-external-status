const request = require("request-promise");
const merge = require("lodash.merge");
const { URL } = require("url");

/**
 * The possible status for a build stage.
 * @typedef {"pending"|"running"|"success"|"failed"|"canceled"} CommitState
*/

/**
 * Options to ocnfigure {@link ExternalStatus}
 * @typedef {Object} ExternalStatusOptions
 * @property {String} [gitlab] The domain for the GitLab server to send data to.  Paths inside this URL will be
 *   automatically stripped.  Defaults to `https://gitlab.com/`.
 * @property {String} project The GitLab project reference to submit data to.
 * @property {String} commit The commit SHA to submit the status under.
 * @property {String} token A GitLab private or personal access token to authenticate with.
 * @property {String} [ref] the GitLab reference to submit the status under.  Can use a branch or tag name.
 *   Defaults to `"default"`.
 * @property {String} [name] The name of the job to submit to GitLab.
 * @property {String} [state] The result state of the job.  Defaults to `"success"`.
 * @property {String} [desc] A description of the job result.
 * @property {String} [url] The target URL that the job links to from GitLab.
 * @property {Object} [query] Custom query-string parameters to include.
*/

/**
 * Options to configure sending shields via {@link ExternalStatus#shield}.  Extends {@link ExternalStatusOptions}.
 * @see https://shields.io/
 * @typedef {ExternalStatusOptions} ExternalStatusShieldOptions
 * @property {String} [shieldLabel] the text on the left side of the shield.  Defaults to the `name` given.
 * @property {String} [shieldStatus] the text on the right side of the shield.  Defaults to the `desc` given.
 * @property {String} [shieldColor] the primary background color for the shield.  Defaults to using an appropriate color
 *   for the `state` given.
*/

/**
 * The default options for {@link ExternalStatus}
 * @todo Use these options in `bin/` scripts.
*/
const defaultOptions = {
  gitlab: "https://gitlab.com/",
  ref: "default",
  state: "success",
};

/**
 * Sends the status of a commit to GitLab.
 * @see https://docs.gitlab.com/ee/api/commits.html#commit-status
*/
class ExternalStatus {

  /**
   * @param {ExternalStatusOptions} opts default options for all statuses sent from this instance.
  */
  constructor(opts) {
    this.opts = opts;
  }

  /**
   * A default shield color for each possible state.
   * @return {Object<String, String>} the default shield colors.
   */
  get _stateColors() {
    return {
      pending: "yellow",
      running: "blue",
      success: "brightgreen",
      failed: "red",
      canceled: "lightgrey",
    };
  }

  /**
   * Determines the shield color to use for a given state, and defaults to `"lightgrey"` if not given a known state.
   * @param {CommitState} state the state of the commit.
   * @return {String} the color to use for the given state.
  */
  colorForState(state) {
    if(this._stateColors[state]) {
      return this._stateColors[state];
    }
    console.warn(`Can't fetch color for unknown state: ${state}`);
    return "lightgrey";
  }

  /**
   * Escapes strings for [shields.io](https://shields.io).
   * @param {String} str the input string to escape
   * @return {String} the input string with special characters replaced.
  */
  static shieldEscape(str) {
    if(typeof str !== "string" || typeof str.replace !== "function") {
      throw new TypeError(`ExternalStatus#shieldEscape must be given a string.  Given ${typeof str} '${str}'.`);
    }
    return str.replace("_", "__").replace(" ", "_").replace("-", "--");
  }

  /**
   * Provides a GitLab status with a shield from [shields.io](https://shields.io) as the target URL.
   * @param {ExternalStatusShieldOptions} [opts] options to configure the generated shield.
   * @return {Promise} resolves when the status has been sent.
   * @todo Make sure unit tests hit all cases.
   * @todo Support all custom badge options: https://shields.io/#your-badge  Make sure any changes are reflected in the
   *   options typedef and in the `bin/` scripts.
  */
  shield(opts) {
    opts = merge({}, defaultOptions, this.opts, opts);
    opts = merge({}, {
      shieldLabel: opts.name,
      shieldStatus: opts.desc,
      shieldColor: this.colorForState(opts.state),
    }, opts);
    const label = this.constructor.shieldEscape(opts.shieldLabel || "");
    const status = this.constructor.shieldEscape(opts.shieldStatus || "");
    const color = this.constructor.shieldEscape(opts.shieldColor);
    return this.status(merge({}, {
      url: `https://img.shields.io/badge/${label}-${status}-${color}.svg`,
    }, opts));
  }

  /**
   * Upload a status to GitLab.
   * @param {ExternalStatusOptions} opts override any options set in the constructor.
   * @return {Promise} resolves when the status has been sent.
   * @todo Write unit tests
   * @todo Write entrypoint in `bin`.
  */
  status(opts) {
    opts = merge({}, this.opts, defaultOptions, this.opts, opts);
    if(typeof opts.token !== "string") {
      console.warn(`[WARN] Not given a private token to use for GitLab authentication (given ${typeof opts.token})`);
    }
    else if(opts.token.length < 5) {
      console.warn(`[WARN] Token for private authentication is very short (${opts.token.length} characters).`);
    }
    const domain = new URL(opts.gitlab).origin;
    const uri = new URL(`${domain}/api/v4/projects/${opts.project}/statuses/${opts.commit}`).href;
    return request({
      method: "POST",
      uri,
      qs: merge({
        ref: opts.ref,
        name: opts.name,
        state: opts.state,
        description: opts.desc,
        target_url: opts.url,
      }, opts.query),
      headers: {
        "PRIVATE-TOKEN": opts.token,
      },
    });
  }

}

module.exports = ExternalStatus;
