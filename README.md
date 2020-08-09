# Clickup/Freshbooks Integration Tool

## Introduction
[Clickup](https://www.clickup.com) is a productivity platform that can be used as a project management tool.

[Freshbooks](https://www.freshbooks.com) is an invoicing cloud platform.

Each month, I needed to go into my Clickup tasks which had a status of "awaiting invoicing," and manually enter them into Freshbooks.

I created this tool in order to leverage the APIs of both systems in order to automatically export tasks from Clickup and create invoices in Freshbooks.

## Technologies Used
* Vue.js
* Vuex (with vue-pathify to save on boilerplate)
* Vue Router
* Vuetify
* Firebase (Auth and Firestore modules)
* Axios

## Features
1. Extracted API calls into external services (/src/utils/*-service.js)
2. Integrated Firebase Auth with Vue Router to protect various views
3. Payments processed by [Stripe](https://www.stripe.com)
4. Orders submit to a backend portal (see above) where they are stored for processing.

## Demo

Contact me at [matt@beaumontwebdev.com](mailto:matt@beaumontwebdev.com) for a demo!

## TODO

1. Add Unit/E2E tests
2. Add logic to create PWA
3. Refactor larger components into smaller sections. 
4. Make this app more generic so others would be able to use it.