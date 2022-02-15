# Case Assist Flow cookbook

A pre-built example of a Lightning Flow utilizing the [Coveo Quantic Case Assist components](https://docs.coveo.com/en/quantic/latest/reference/case-assist-components/) in order to:

1. Predict case classification values depending on the case Subject and Description given by the customer.
2. Suggest documents that can potentially solve the customer's case before it is created.
3. Track user interactions with the different components and screens across the entire case assist flow.

It is distributed as an example of best practices when requesting field predictions and document suggestions from the Coveo Customer Service API.

It requires an active Coveo organization with indexed Salesforce Cases in order to provide field predictions.

It requires a working deployment of a [Case Assist Configuration](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations) to provide [Document Suggestions](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-document-suggestion-functionality) as well as [Case Classifications](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-case-classification-functionality).

## Table of Contents

- [What Is Included in This Project](#what-is-included-within-this-project): A description of the contents of this repository.

- [How to Deploy](#how-to-deploy): This is the recommended installation option. Use this option if you want to see the app and the code in action.

- [How to Add New Fields for Classification](#how-to-add-new-fields-for-classification): A guide to specify additional fields for classification.

## What Is Included in This Project

This project contains two flows: a Recommended Flow and a Demo flow. Both are lightning flows already setup with multiple steps to create a support case.

### Recommended Flow:

The Recommended Flow contains the following screens:

1. A first screen where the user can enter a Subject and a Description for their case and can see the strength of this Description using the Description Strength Indicator.
2. A second screen where the user can find predictions to help classify their case. This screen will predict values for the Case Priority, Case Type, and Case Reason fields as these are Standard Salesforce Case fields.
3. A third screen where documents will be suggested to the user based on the text entered in the case Subject and Description. The user can read more about each document suggestion with the help of the Quickview and can also leave their feedback on each document.
4. A confirmation screen that the case was created.

### Demo Flow:

The Demo Flow contains the following screens:

1. A first screen where the user can enter a Subject and a Description for their case and can see the strength of this Description, using the Description Strength Indicator, as well as the predictions to help classify their case. The user can see the predictions for the Case Priority, Case Type, and Case Reason fields as they type in the Subject and Description inputs.
2. A second screen where documents will be suggested to the user based on the text entered in the case Subject and Description. The user can read more about each document suggestion with the help of the Quickview and can also leave their feedback on each document.
3. A confirmation screen that the case was created.

PS: A Login screen is implemented in both flows. It's just a template that you can use to provide a custom login screen to access the case assist flow.

## How to Deploy

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

### 2. Install the Quantic Library

[Install the Coveo Quantic Library as a Salesforce unlocked package](https://docs.coveo.com/en/quantic/latest/usage/#install-quantic).

### 3a. Deploy the Project Using the Org Development Model

The Org Development Model allows you to connect directly to a non-source-tracked org (sandbox, Developer Edition (DE) org, Trailhead Playground, or even a production org) to retrieve and deploy code directly. This model is similar to the type of development you have done in the past using tools such as Force.com IDE or MavensMate.

To start developing with this model in Visual Studio Code, see [Org Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-development-model). For details about the model, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/modules/org-development-model) Trailhead module.

When working with non-source-tracked orgs, use the commands `SFDX: Deploy Source to Org` (VS Code) or `sfdx force:source:deploy` (Salesforce CLI) and `SFDX: Retrieve Source from Org` (VS Code) or `sfdx force:source:retrieve` (Salesforce CLI). The `Push` and `Pull` commands work only on orgs with source tracking (scratch orgs).

### 3b. Push the Code in a Scratch Org

When working with source-tracked orgs, use the commands `SFDX: Push Source to Org` (VS Code) or `sfdx force:source:push` (Salesforce CLI) and `SFDX: Pull Source from Org` (VS Code) or `sfdx force:source:pull` (Salesforce CLI). Do not use the `Retrieve` and `Deploy` commands with scratch orgs.

### 3c. Installing the app using an Unlocked Package

TBD

### 4. How to enable the Case Flow in your community

1. In your Salesforce community, drag the Lightning Flow component onto a Community page and select the Case_Assist_Recommended_Flow or the Case_Assist_Demo_Flow shipped with this repository.
2. After selecting the name of the flow two inputs labeled caseAssistId and engineId appear. Fill the caseAssistId input with your [Case Assist Id](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#retrieving-a-case-assist-id "Case Assist Id") retrieved from your Case assist Configuration and fill the enginId input with an appropriate name for the engine that the Quantic components will register to.
3. In the published version of your community, users can now fill in the subject and description fields in the first screen. If they proceed to the next screens to see the proposed predictions for classifying their case and get documents suggestions that will potentially resolve their case before it is created.

### Dev, Build and Test

1. Run `npm i`
1. Run `npm run build`
1. Run `npm run test`
1. Now you can deploy with `sfdx force:source:deploy...`

### Developing locally

Unfortunately since this example is meant to be included in a flow, it has trouble running on the local dev server:
https://developer.salesforce.com/docs/component-library/documentation/lwc/get_started_local_dev_setup

### Testing

TBD

## How to Add New fields for Classification

This cookbook suggests classifications for the standard case fields Case Priority, Case Type, and Case Reason.
To specify additional fields for classification, access the [Provide Details Screen](src/main/default/lwc/provideDetailsScreen) and copy the sample code that are commented out in the `provideDetailsScreen.html` and `provideDetailsScreen.js` files as many times as necessary. Remember to replace the placeholders `<SALESFORCE_API_FIELD_NAME>` and `<COVEO_FIELD_NAME>` with the Salesforce API name and the Coveo field name of the new field to predict, respectively.
Make sure that all newly added fields are specified in your configuration (see [Configuring the Case Classification Functionality](https://docs.coveo.com/en/3328/#configuring-the-case-classification-functionality)).
