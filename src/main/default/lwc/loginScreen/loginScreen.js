import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';
import logIn from '@salesforce/label/c.cookbook_LogIn';
import describeProblem from '@salesforce/label/c.cookbook_DescribeProblem';
import provideDetails from '@salesforce/label/c.cookbook_ProvideDetails';
import reviewResources from '@salesforce/label/c.cookbook_ReviewResources';
import username from '@salesforce/label/c.cookbook_Username';
import password from '@salesforce/label/c.cookbook_Password';
import forgetYourPassword from '@salesforce/label/c.cookbook_ForgetYourPassword';
import rememberMe from '@salesforce/label/c.cookbook_RememberMe';
import getHelp from '@salesforce/label/c.cookbook_GetHelp';
import loginTitle from '@salesforce/label/c.cookbook_LoginTitle';
import loginSubtitle from '@salesforce/label/c.cookbook_LoginSubtitle';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class LoginScreen extends LightningElement {
  labels = {
    logIn,
    describeProblem,
    provideDetails,
    reviewResources,
    username,
    password,
    rememberMe,
    forgetYourPassword,
    getHelp,
    loginTitle,
    loginSubtitle
  };

  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  /**
   * The Case Assist configuration ID.
   * @type {string}
   */
  @api caseAssistId;
  /**
   * availableActions is an array that contains the available flow actions when this component is used within a flow
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];

  /** @type {CaseAssistEngine} */
  engine;

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  /**
   * @param {CaseAssistEngine} engine
   */
  initialize = (engine) => {
    this.engine = engine;
    this.actions = {
      // eslint-disable-next-line no-undef
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine)
    };
    if (!sessionStorage.previousNavigation) {
      engine.dispatch(this.actions.logCaseStart());
    }
  };

  value = [];
  get options() {
    return [{ label: this.labels.rememberMe, value: 'option1' }];
  }

  handleButtonNext() {
    if (this.availableActions.some((action) => action === 'NEXT')) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
      this.engine.dispatch(this.actions.logCaseNextStage());
    }
  }

  steps = [
    { label: this.labels.logIn, active: true },
    { label: this.labels.describeProblem, active: false },
    { label: this.labels.provideDetails, active: false },
    { label: this.labels.reviewResources, active: false }
  ];
}
