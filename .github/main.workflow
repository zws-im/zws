workflow "New workflow" {
  on = "push"
  resolves = ["Lint"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "install"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
  runs = "lint"
}
