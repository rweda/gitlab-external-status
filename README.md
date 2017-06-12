# GitLab External Status Client

[![Build Status](https://travis-ci.org/rweda/gitlab-external-status.svg?branch=master)](https://travis-ci.org/rweda/gitlab-external-status)

Add extra details to a GitLab CI pipeline.

## Example

(`$GITLAB_TOKEN` has already been set to a GitLab personal access token)

```bash
$(npm bin)/build-status shield --name "Lint" --desc "2 Warnings, 0 Failures" \
  --shield-color "orange"
```

![Sample Output](assets/shield-status.png)
*Inline shields powered by TamperMonkey script [Inline Shields.io][]*.

## CLI Usage

![script usage](https://rweda.github.io/gitlab-external-status/docs/cli-help.png)

![script `shield` usage](https://rweda.github.io/gitlab-external-status/docs/cli-shield-help.png)

[Inline Shields.io]: https://github.com/rweda/inline-shields.io
