workflow "New workflow" {
  on = "push"
  resolves = ["Deploy Firebase Functions"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
  args = "lint"
}

action "Deploy Firebase Functions" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Lint"]
  args = "deploy --only functions"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
}

action "Deploy Firebase Hosting" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Lint"]
  args = "deploy --only hosting"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
}

action "Deploy Firebase Firestore" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Lint"]
  args = "deploy --only firestore"
  secrets = ["FIREBASE_TOKEN"]
  env = {
    PROJECT_ID = "zero-width-shortener"
  }
}
