workflow "Test and deploy to Firebase on push" {
  resolves = [
    "Deploy Firebase Firestore",
    "Deploy Firebase Functions",
    "Install hosting dependencies",
    "Deploy Firebase Hosting",
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
  needs = ["Lint functions"]
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
}

action "Lint hosting" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install hosting dependencies"]
  args = "-- prefix ./public run lint"
}

action "Deploy Firebase Hosting" {
  uses = "pizzafox/firebase-action@master"
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
  needs = ["Lint hosting"]
  secrets = ["FIREBASE_TOKEN"]
  args = "deploy --only hosting"
}
