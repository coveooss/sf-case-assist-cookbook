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

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class DescribeProblemScreen extends LightningElement {
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
   * The Case Assist configuration ID.
   * @type {string}
   */
  @api caseAssistId;
  /**
   * A stringified object representing the current fields set on the case.
   * @type {string}
   */
  @api caseData;

  /** @type {object} */
  theCase;
  /** @type {string} */
  subject = '';
  /** @type {string} */
  description = '';

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
    this.extractDataFromSessionStorage();
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  /**
   * @param {CaseAssistEngine} engine
   */
  initialize = (engine) => {
    this.actions = {
      // eslint-disable-next-line no-undef
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine)
    };
    if (!sessionStorage.previousNavigation) {
      engine.dispatch(this.actions.logCaseStart());
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
    }
  }

  handleBack() {
    if (this.availableActions.some((action) => action === 'BACK')) {
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
    }
  }

  getCaseValues() {
    const { subjectInput, descriptionInput } = this.getInputs();
    this.theCase = {
      subject: subjectInput.value,
      description: descriptionInput.value
    };
  }

  updateFlowState() {
    this.getCaseValues();
    this._caseData = JSON.stringify(this.theCase);
    const attributeChangeEvent = new FlowAttributeChangeEvent(
      'caseData',
      this._caseData
    );
    this.dispatchEvent(attributeChangeEvent);
    sessionStorage.caseData = this._caseData;
  }

  inputValidity() {
    const { subjectInput, descriptionInput } = this.getInputs();
    subjectInput.reportValidity();
    descriptionInput.validate();
    return !subjectInput.hasError && descriptionInput.validity;
  }

  getInputs() {
    const subjectInput = this.template.querySelector('c-subject-input');
    const descriptionInput = this.template.querySelector('c-description-input');
    return { subjectInput, descriptionInput };
  }

  extractDataFromSessionStorage() {
    if (sessionStorage.previousNavigation && sessionStorage.caseData) {
      const sessionStorageObject = JSON.parse(sessionStorage.caseData);
      this.subject = sessionStorageObject.subject;
      this.description = sessionStorageObject.description;
    }
  }
}
