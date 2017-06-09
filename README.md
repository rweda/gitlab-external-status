# GitLab External Status Client

[![Build Status](https://travis-ci.org/rweda/gitlab-external-status.svg?branch=master)](https://travis-ci.org/rweda/gitlab-external-status)

Add extra details to a GitLab CI pipeline.

## Example

```bash
$(npm bin)/build-status shield --name "Lint" --desc "2 Warnings, 0 Failures" \
  --shield-color "orange"
```

![Sample Output](assets/shield-status.png)
*Inline shield powered by TamperMonkey script 'Inline Shields.io'*.
