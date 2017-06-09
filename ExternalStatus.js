/**
 * The possible status for a build stage.
 * @typedef {"pending"|"running"|"success"|"failed"|"canceled"} CommitState
*/

/**
 * Sends the status of a commit to GitLab.
 * @see https://docs.gitlab.com/ee/api/commits.html#commit-status
*/
class ExternalStatus {

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

  /* eslint-disable no-unused-vars */
  /**
   * Provides a shield to GitLab.
   * @param {Object} opts options to configure the generated shield.
   * @return {void}
   * @todo Improve docs.
   * @todo Implement method.
   * @todo Unit test.
  */
  shield(opts) {
    return;
  }
  /* eslint-enable no-unused-vars */

}

module.exports = ExternalStatus;
