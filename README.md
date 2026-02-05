# Case Assist Flow cookbook

A pre-built example of a Lightning Flow utilizing the [Coveo Quantic components](https://docs.coveo.com/en/quantic/) in order to:

1. Predict case classification values depending on the case Subject and Description given by the customer.
2. Suggest documents that can potentially solve the customer's case before it is created using the **Search API**.
3. Track user interactions with the different components and screens across the entire case assist flow through Coveo Analytics and Reports.

It is distributed as an example of best practices when using the Coveo Search API for document suggestions and the Customer Service API for field predictions.

## Search API for Document Suggestions

This cookbook uses the **Search API** instead of the Document Suggestion API (`QuanticDocumentSuggestion`) for document suggestions. This approach provides:

- **Full control over query context**: Send case fields as search context
- **Support for Generative Answering**: Enable AI-powered answers
- **Better analytics and debugging**: Improved observability and value measurement
- **Advanced features**: Support for Smart Snippets, Triggers, and custom ranking strategies
- **Future-proof architecture**: Aligns with modern Coveo search capabilities

The `caseAssistSearch` component in this cookbook demonstrates how to:
- Use `quantic-search-interface` with Headless context actions
- Send case context (Subject, Description, and custom fields) to the Search API
- Display search results with voting/rating functionality
- Integrate Generative Answering and Smart Snippets

### Why Search API over Document Suggestion?

Based on feedback from live Case Assist deployments, the Search API approach addresses limitations of the Document Suggestion API:
- Document Suggestion uses a restricted payload (typically limited to subject and description)
- It automatically maps input to the `lq` parameter, reducing control over query composition
- It provides limited context handling, mostly usable only through pipeline rules
- It cannot support Generative Answering or advanced search features

For production Case Assist implementations, the Search API approach is **recommended** over Document Suggestion.

It requires an active Coveo organization with indexed content to provide document suggestions.

It requires a [Case Assist Configuration](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations) to provide [Case Classifications](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-case-classification-functionality).

## Table of Contents

- [Search API for Document Suggestions](#search-api-for-document-suggestions): Overview of the Search API approach used in this cookbook.

- [What Is Included in This Project](#what-is-included-in-this-project): A description of the contents of this repository.

- [Prerequisites](#prerequisites): A detailed list of required installations, configurations, and dependencies necessary to set up and use the Case Assist Cookbook effectively.

- [How to Deploy](#how-to-deploy): This is the recommended installation option. Use this option if you want to see the app and the code in action.

- [How to Add New Fields for Classification](#how-to-add-new-fields-for-classification): A guide to specify additional fields for classification.

## What Is Included in This Project

This project contains two flows: a Recommended Flow and a Demo flow. Both are lightning flows already setup with multiple steps to create a support case.

### Recommended Flow:

The Recommended Flow contains the following screens:

1. A first screen where the user can enter a Subject and a Description for their case and can see the strength of this Description using the Description Strength Indicator.
2. A second screen where the user can find predictions to help classify their case. This screen will predict values for the Case Priority, Case Type, and Case Reason fields as these are Standard Salesforce Case fields. See [How to Add New Fields for Classification](#how-to-add-new-fields-for-classification) section to learn how to modify these.
3. A third screen where documents will be suggested to the user based on the case context using the **Coveo Search API**. The search results include Generative Answering, Smart Snippets, and Triggers. The user can read more about each document with the help of the Quickview and can also leave their feedback on each document.
4. A confirmation screen that the case has been successfully created.

Here is a demo video of this flow in action: [Demo of the new Coveo Case Assist Experience](https://youtu.be/WvHKYbiZRNI).

### Demo Flow:

The Demo Flow contains the following screens:

1. A first screen where the user can enter a Subject and a Description for their case and can see the strength of this Description, using the Description Strength Indicator, as well as the predictions to help classify their case. The user can see the predictions for the Case Priority, Case Type, and Case Reason fields as they type in the Subject and Description inputs. See [How to Add New Fields for Classification](#how-to-add-new-fields-for-classification) section to learn how to modify these.
2. A second screen where documents will be suggested to the user based on the case context using the **Coveo Search API**. The search results include Generative Answering, Smart Snippets, and Triggers. The user can read more about each document with the help of the Quickview and can also leave their feedback on each document.
3. A confirmation screen that the case has been successfully created.

PS: A Login screen is implemented in both flows. It's just a template that you can use to provide a custom login screen to access the case assist flow.

## Prerequisites

### 1. Set Up Coveo Organization and Content

- You need an active Coveo organization with indexed content to provide document suggestions through the Search API.
- Indexed content should be relevant to your support use cases (knowledge base articles, documentation, etc.).
- Follow the [Coveo Documentation](https://docs.coveo.com/en/1546/index-content/content-sources-overview) for setting up content sources.

### 2. Set Up a Coveo Case Assist Configuration (for Case Classifications)

- Create a Case Assist configuration in your Coveo Administration Console. This configuration defines the case classifications returned by the Case Assist API.
- Note: This is only required for the **case classification** functionality (predicting Case Priority, Case Type, etc.), not for document suggestions which now use the Search API.
- Follow the [Coveo Documentation on Creating a Case Assist Configuration](https://docs.coveo.com/en/3328/service/manage-case-assist-configurations#configuring-the-case-classification-functionality).

### 3. Install and configure the Coveo for Salesforce package

- Install and configure the Coveo for Salesforce managed package in your Salesforce org by following the [Coveo for Salesforce Getting Started Guide](https://docs.coveo.com/en/1158/coveo-for-salesforce/get-started-with-coveo-for-salesforce).

## How to Deploy

### 1. Set up Your Environment

- Install [npmjs](https://www.npmjs.com/get-npm)

- Run the setup tasks

```
npm install
```

- Follow the steps to set up your development environment for example in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. You will:

  - Enable Dev Hub in your Trailhead Playground
  - Install Salesforce CLI
  - Install Visual Studio Code
  - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

> These steps assume you already have the [Coveo for Salesforce package installed](https://docs.coveo.com/en/1158/coveo-for-salesforce/getting-started-with-coveo-for-salesforce) and configured (linked to a Coveo organization).

### 2. Install the Quantic Library

This cookbook requires **Quantic 3.x** or later for full functionality, including:
- Generative Answering (`quantic-generated-answer`)
- Smart Snippets (`quantic-smart-snippet-suggestions`)
- Query Triggers (`quantic-triggers`)

[Install the Coveo Quantic Library as a Salesforce unlocked package](https://docs.coveo.com/en/quantic/latest/usage/#install-quantic).

**Note:** The cookbook dependency is configured for Quantic 3.x. If you need to use Quantic 2.x, some advanced search features will not be available.

### 3. Deploying the Project

#### 3a. Deploy the Project Using the Org Development Model

The Org Development Model allows you to connect directly to a non-source-tracked org (sandbox, Developer Edition (DE) org, Trailhead Playground, or even a production org) to retrieve and deploy code directly. This model is similar to the type of development you have done in the past using tools such as Force.com IDE or MavensMate.

To start developing with this model in Visual Studio Code, see [Visual Studio Code for Salesforce Development](https://trailhead.salesforce.com/content/learn/projects/quickstart-vscode-salesforce/use-vscode-for-salesforce). For details about the model, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/projects/quickstart-vscode-salesforce) Trailhead module.

```
sfdx force:source:deploy
```

#### 3b. Deploy the project in a Scratch Org

Use the command `SFDX: Push Source to Org` in VS Code or type the following SFDX command in your CLI:

```
sfdx force:source:push
```

#### 3c. Install the App Using an Unlocked Package

Type the following SFDX command in your CLI:

```
sfdx force:package:install --package 04tKg000000kZt7IAE -u <USER_NAME>
```

Where you replace <USER_NAME> by your username in the target organization.

### 4. Enable the Case Flow in Your Community

1. In your Salesforce community, drag the Lightning Flow component in a Community page, and then select the `Case_Assist_Recommended_Flow` or the `Case_Assist_Demo_Flow` shipped with this repository.
2. After selecting the name of the flow, you must fill the `caseAssistId`, the `engineId` and the `searchHub` fields.
   1. In the `caseAssistId` field, enter your [Case Assist ID](https://docs.coveo.com/en/3328/#retrieving-a-case-assist-id), retrieved from your Case Assist Configuration. This is used for case classification predictions.
   2. In the `engineId` field, enter a unique identifier for the engine instance (e.g., `case-assist-engine`). This name will be used by the Quantic components to register to the correct engine instance.
   3. In the `searchHub` field, enter the search hub name you want to use for analytics tracking (e.g., `CaseAssist` or your Case Assist configuration name).
   4. Leave the `caseData` field blank.
3. After linking your installed Coveo for Salesforce package to a Coveo organization, make sure to go change the content of the Apex class `CaseAssistController`. By default it will try to query a sample organization. Replace this method with the commented method just below it to generate a Platform token and query your selected Coveo organization.
4. In the published version of your community, users can now fill in the Subject and Description fields on the first screen. They can then proceed to the next screens to view the predicted classification values for their case, and get document suggestions powered by the Search API to help them potentially resolve their case before submitting it.

### Dev, Build and Test

1. Run `npm i`
1. Run `npm run test`
1. Now you can deploy with `sfdx force:source:deploy...`

## Authentication and Security

This cookbook uses the `CaseAssistController` Apex class to generate tokens for accessing Coveo services.

- **API Key**: You can use an API key which will grant access to Coveo results that are "public". This is simpler to set up but limits content to public documents.
- **Platform Token**: You can use a Platform token to leverage the identity of the current user and get access to content that's not necessarily only "public". This provides better security and content filtering based on user permissions.

The Search API approach used in this cookbook for document suggestions works with both API keys and Platform tokens, providing flexibility in your authentication strategy.

## How to Add New Fields for Classification

This cookbook suggests classifications for the standard case fields Case Priority, Case Type, and Case Reason.
To specify additional fields for classification, access the [Provide Details Screen](src/main/default/lwc/provideDetailsScreen) and copy the sample code that are commented out in the `provideDetailsScreen.html` and `provideDetailsScreen.js` files as many times as necessary. Remember to replace the placeholders `<SALESFORCE_API_FIELD_NAME>` and `<COVEO_FIELD_NAME>` with the Salesforce API name and the Coveo field name of the new field to predict, respectively. You can find the Coveo Field Name in the [Fields](https://docs.coveo.com/en/2036/index-content/about-fields) section of the Coveo Admin Console.  
Make sure that all newly added fields are specified in your configuration (see [Configuring the Case Classification Functionality](https://docs.coveo.com/en/3328/#configuring-the-case-classification-functionality)).
