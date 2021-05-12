# Case Assist Flow cookbook

A pre-built example of a Lightning Flow utilizing [Coveo Customer Service](https://docs.coveo.com/en/3327/service/coveo-customer-service) capabilities in order to:

1. Predict case classification values depending on the case description given by the customer.
2. Suggest documents that can potentially solve the customer's case before it is created.

It is distributed as an example of best practices when requesting field predictions and document suggestions from the Coveo Customer Service API.

It requires an active Coveo organization with indexed Salesforce Cases in order to provide field predictions.

It requires a working deployment of a [Case Assist Configuration](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations) to provide [Document Suggestions](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-document-suggestion-functionality) as well as [Case Classifications](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-case-classification-functionality).

## Table of contents

- [How to deploy](#how-to-deploy): This is the recommended installation option. Use this option if you want to experience the app and the code.

- [Installing the app using an Unlocked Package](#2c-installing-the-app-using-an-unlocked-package): This option allows anybody to experience the sample app without installing a local development environment.

- [Description of Files and Directories](#description-of-files-and-directories): A description of all the content of this repository.

## What is included within this project

1. A lightning flow already setup with multiple steps to create a support case.
2. A first screen where the user can enter a Subject and a Description for their case. This screen will predict values for the `Case Reason` field as it is a Standard Salesforce Case field.
3. A second screen where documentation will be suggested to the customer based on the text entered in the case Subject and Description.
4. A final screen where the customer can review their case information if they were not able to solve it.
5. A confirmation screen that the case was created.

## How to deploy

### 1. Set up your environment

- Install [npmjs](https://www.npmjs.com/get-npm)

- Run the setup tasks

```
npm install
npm run build
```

- Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. You will:

  - Enable Dev Hub in your Trailhead Playground
  - Install Salesforce CLI
  - Install Visual Studio Code
  - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

> These steps assume you already have the [Coveo for Salesforce package installed](https://docs.coveo.com/en/1158/coveo-for-salesforce/getting-started-with-coveo-for-salesforce) and configured (linked to a Coveo organization).

### 2a. Deploying the project with the Org Development Model

The Org Development Model allows you to connect directly to a non-source-tracked org (sandbox, Developer Edition (DE) org, Trailhead Playground, or even a production org) to retrieve and deploy code directly. This model is similar to the type of development you have done in the past using tools such as Force.com IDE or MavensMate.

To start developing with this model in Visual Studio Code, see [Org Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-development-model). For details about the model, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/modules/org-development-model) Trailhead module.

When working with non-source-tracked orgs, use the commands `SFDX: Deploy Source to Org` (VS Code) or `sfdx force:source:deploy` (Salesforce CLI) and `SFDX: Retrieve Source from Org` (VS Code) or `sfdx force:source:retrieve` (Salesforce CLI). The `Push` and `Pull` commands work only on orgs with source tracking (scratch orgs).

### 2b. Pushing the code in a Scratch Org

When working with source-tracked orgs, use the commands `SFDX: Push Source to Org` (VS Code) or `sfdx force:source:push` (Salesforce CLI) and `SFDX: Pull Source from Org` (VS Code) or `sfdx force:source:pull` (Salesforce CLI). Do not use the `Retrieve` and `Deploy` commands with scratch orgs.

### 2c. Installing the app using an Unlocked Package

TBD

### 3. How to enable the Case Flow in your community

1. In the class CaseAssistEndpoint. Change this line to add your case assist ID:
   `public static final String CASE_ASSIST_ID = 'YOUR_CASE_ASSIST_ID';`
1. In your Salesforce community, drag the Lightning Flow component onto a Community page and select the Case_Assist_Demo_Flow shipped with this repository.
1. In the published version of your community, fill in the subject and description fields **(minimum of 10 characters in the description)** in the first screen to see the Related Category section appear and get predictions for the Case Reason field.

### 4. Sending analytics with the Case Flow

Make sure you drag and drop the component AnalyticsBeacon somewhere in your community in order for the Case Flow to send analytics events.
We recommend dropping it in your community header or footer region (It is invisible to the end user).

If you do not have it you will see that error in the console : `Analytics Beacon cannot be found, include the component in your page to send events.`.

## Dev, Build and Test

1. Run `npm i`
1. Run `npm run build`
1. Run `npm run test`
1. Now you can deploy with `sfdx force:source:deploy...`

### Developing locally

Unfortunately since this example is meant to be included in a flow, it has trouble running on the local dev server:
https://developer.salesforce.com/docs/component-library/documentation/lwc/get_started_local_dev_setup

### Testing

You can run the included tests:

`npm run:test:watch`

## Dependencies

This cookbook uses the [coveo.analytics.js](https://www.npmjs.com/package/coveo.analytics) library in order to track user interactions with the different components.

It is included as a dependency in this project and served via a static resource within the different components of this repository.

## Description of Files and Directories

## Add New Fields for Classification

This cookbook suggests classifications for the standard case  field `reason`. To specify additional fields for classification, access the [caseAssistFlow folder](src/main/default/lwc/caseAssistFlow) and copy the sample components that are commented out in the `caseAssistFlow.html` and `caseAssistFlow.js` files as many times as necessary. If you are using the Case Review Form,  access the [caseReviewForm folder](src/main/default/lwc/caseReviewForm) and copy the sample components that are commented out in the `caseReviewForm.html` and `caseReviewForm.js` files as well. After modifying these files, access the Coveo Administration Console to update your Case Classification configuration accordingly. Make sure that all newly added fields are specified in your configuration. For more information, see https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-case-classification-functionality. 
