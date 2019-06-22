workflow "Test and deploy to Firebase on push" {
  resolves = [
    "Deploy Firebase Hosting",
    "Deploy Firebase Firestore",
    "Deploy Firebase Functions",
  ]
  on = "push"
}

action "Install functions dependencies" {
  uses = "actions/npm@master"
  args = "--prefix ./functions install"
}

action "Lint" {
  uses = "actions/npm@master"
  args = "--prefix ./functions run lint"
  needs = ["Install functions dependencies"]
}

action "Deploy Firebase Functions" {
  uses = "pizzafox/firebase-action@master"
  needs = ["Lint"]
  args = "deploy --only functions"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
}

action "Install hosting dependencies" {
  uses = "actions/npm@master"
  args = "--prefix ./hosting install -D"
}

action "Deploy Firebase Hosting" {
  uses = "pizzafox/firebase-action@master"
  needs = ["Install hosting dependencies"]
  args = "deploy --only hosting"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
}

action "Deploy Firebase Firestore" {
  uses = "pizzafox/firebase-action@master"
  args = "deploy --only firestore"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
}
