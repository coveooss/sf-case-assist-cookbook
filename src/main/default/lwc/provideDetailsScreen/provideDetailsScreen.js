/* eslint-disable no-undef */
import { LightningElement, api } from 'lwc';
import {
  FlowNavigationNextEvent,
  FlowAttributeChangeEvent,
  FlowNavigationBackEvent
} from 'lightning/flowSupport';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';
import next from '@salesforce/label/c.cookbook_Next';
import previous from '@salesforce/label/c.cookbook_Previous';
import provideDetailsTitle from '@salesforce/label/c.cookbook_ProvideDetailsTitle';
import provideDetailsSubtitle from '@salesforce/label/c.cookbook_ProvideDetailsSubtitle';
import priority from '@salesforce/label/c.cookbook_PriorityLabel';
import origin from '@salesforce/label/c.cookbook_OriginLabel';
import moreOptions from '@salesforce/label/c.cookbook_MoreOptions';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class ProvideDetailsScreen extends LightningElement {
  labels = {
    next,
    previous,
    priority,
    origin,
    provideDetailsTitle,
    provideDetailsSubtitle,
    moreOptions
  };
  /**
   * availableActions is an array that contains the available flow actions when this component is used within a flow
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  /**
   * A stringified object representing the current fields set on the case.
   */
  @api caseData;

  /** @type {CaseAssistEngine} */
  engine;
  /** @type{object} */
  theCase;
  /** @type {string} */
  priority = '';
  /** @type {string} */
  origin = '';

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
    try {
      this._caseData = JSON.parse(this.caseData);
      this.extractDataFromSessionStorage();
    } catch (err) {
      this._caseData = {};
    }
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
      ...CoveoHeadlessCaseAssist.loadCaseFieldActions(engine),
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine)
    };
    if (!sessionStorage.previousNavigation) {
      engine.dispatch(this.actions.fetchCaseClassifications());
    }
  };

  handleNext() {
    if (
      this.availableActions.some((action) => action === 'NEXT') &&
      this.inputValidity()
    ) {
      this.updateFlowState();
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
      sessionStorage.previousNavigation = false;
      sessionStorage.caseData = this._caseData;
      this.engine.dispatch(this.actions.logCaseNextStage());
    }
  }

  handleBack() {
    if (this.availableActions.some((action) => action === 'BACK')) {
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
      sessionStorage.previousNavigation = true;
    }
  }

  getCaseValues() {
    const { priorityInput, originInput } = this.getInputs();

    this._caseData = {
      ...this._caseData,
      priority: priorityInput.value,
      origin: originInput.value
    };
  }

  updateFlowState() {
    this.getCaseValues();
    this._caseData = JSON.stringify(this._caseData);
    const attributeChangeEvent = new FlowAttributeChangeEvent(
      'caseData',
      this._caseData
    );
    this.dispatchEvent(attributeChangeEvent);
  }

  inputValidity() {
    const inputs = Object.values(this.getInputs());
    inputs.forEach((input) => {
      input.reportValidity();
    });
    return inputs.reduce(
      (previousValidity, input) => previousValidity && !input.hasError,
      true
    );
  }

  getInputs() {
    const priorityInput = this.template.querySelector(
      'c-quantic-case-classification[title="priority"]'
    );
    const originInput = this.template.querySelector(
      'c-quantic-case-classification[title="origin"]'
    );
    return { priorityInput, originInput };
  }

  extractDataFromSessionStorage() {
    if (sessionStorage.previousNavigation && sessionStorage.caseData) {
      const sessionStorageObject = JSON.parse(sessionStorage.caseData);
      this.priority = sessionStorageObject.priority;
      this.origin = sessionStorageObject.origin;
    }
  }
}
