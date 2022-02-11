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
import reason from '@salesforce/label/c.cookbook_ReasonLabel';
import typeLabel from '@salesforce/label/c.cookbook_TypeLabel';
import moreOptions from '@salesforce/label/c.cookbook_MoreOptions';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class ProvideDetailsScreen extends LightningElement {
  labels = {
    next,
    previous,
    priority,
    reason,
    typeLabel,
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
   * A JSON-serialized object representing the current case fields.
   */
  @api caseData;

  /** @type {CaseAssistEngine} */
  engine;
  /** @type{object} */
  _caseData;
  /** @type {object} */
  sessionStorageCaseObject = {};

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

    if (sessionStorage.valuesUpdated) {
      engine.dispatch(this.actions.fetchCaseClassifications());
      sessionStorage.valuesUpdated = false;
    }
  };

  canMoveNext() {
    return (
      this.availableActions.some((action) => action === 'NEXT') &&
      this.inputValidity()
    );
  }

  canMovePrevious() {
    return this.availableActions.some((action) => action === 'BACK');
  }

  handleNext() {
    if (this.canMoveNext()) {
      this.updateFlowState();
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
      this.engine.dispatch(this.actions.logCaseNextStage());
    }
  }

  handlePrevious() {
    if (this.canMovePrevious()) {
      this.updateFlowState();
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
    }
  }

  updateFlowState() {
    this.updateCaseValues();
    const attributeChangeEvent = new FlowAttributeChangeEvent(
      'caseData',
      JSON.stringify(this._caseData)
    );
    this.dispatchEvent(attributeChangeEvent);
    sessionStorage.caseData = JSON.stringify(this._caseData);
  }

  updateCaseValues() {
    const { priorityInput, reasonInput, typeInput } = this.getInputs();

    this._caseData = {
      ...this._caseData,
      priority: priorityInput.value,
      reason: reasonInput.value,
      type: typeInput.value
    };
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
    const reasonInput = this.template.querySelector(
      'c-quantic-case-classification[title="reason"]'
    );
    const typeInput = this.template.querySelector(
      'c-quantic-case-classification[title="type"]'
    );
    return { priorityInput, reasonInput, typeInput };
  }

  extractDataFromSessionStorage() {
    if (!sessionStorage.valuesUpdated && sessionStorage.caseData) {
      try {
        this.sessionStorageCaseObject = JSON.parse(sessionStorage.caseData);
      } catch (err) {
        this.sessionStorageCaseObject = {};
      }
    }
  }
}
