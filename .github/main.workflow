workflow "Test and deploy to Firebase on push" {
  resolves = [
    "Deploy Firebase Firestore",
    "Deploy Firebase Functions",
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

action "Deploy Firebase Firestore" {
  uses = "pizzafox/firebase-action@master"
  args = "deploy --only firestore"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
  needs = ["Filter for master branch"]
}

action "Filter for master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}
