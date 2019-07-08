workflow "Test and deploy to Firebase on push" {
  resolves = [
    "Deploy Firebase Firestore",
    "Deploy Firebase Functions",
    "Install hosting dependencies",
    "Deploy Firebase Hosting",
    "Filter for master branch",
  ]
  on = "push"
}

action "Install functions dependencies" {
  uses = "actions/npm@master"
  args = "--prefix ./functions install"
}

action "Lint functions" {
  uses = "actions/npm@master"
  args = "--prefix ./functions run lint"
  needs = ["Install functions dependencies"]
}

action "Deploy Firebase Functions" {
  uses = "pizzafox/firebase-action@master"
  args = "deploy --only functions"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
  needs = [
    "Lint functions",
    "Filter for master branch",
  ]
}

action "Install hosting dependencies" {
  uses = "actions/npm@master"
  args = "--prefix ./public install -D"
}

action "Deploy Firebase Firestore" {
  uses = "pizzafox/firebase-action@master"
  args = "deploy --only firestore"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
  needs = ["Filter for master branch"]
}

action "Lint hosting" {
  uses = "actions/npm@master"
  needs = ["Install hosting dependencies"]
  args = "-- prefix ./public run lint"
}

action "Deploy Firebase Hosting" {
  uses = "pizzafox/firebase-action@master"
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
  needs = [
    "Lint hosting",
    "Filter for master branch",
  ]
  secrets = ["FIREBASE_TOKEN"]
  args = "deploy --only hosting"
}

action "Filter for master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}
