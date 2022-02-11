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
import describeProblemTitle from '@salesforce/label/c.cookbook_DescribeProblemTitle';
import next from '@salesforce/label/c.cookbook_Next';
import previous from '@salesforce/label/c.cookbook_Previous';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class DescribeProblemScreen extends LightningElement {
  labels = {
    describeProblemTitle,
    next,
    previous
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
   * The Case Assist configuration ID.
   * @type {string}
   */
  @api caseAssistId;
  /**
   * A JSON-serialized object representing the current case fields.
   * @type {string}
   */
  @api caseData;

  /** @type {CaseAssistEngine} */
  engine;
  /** @type {object} */
  _caseData;
  /** @type {object} */
  sessionStorageCaseObject = {};

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
    sessionStorage.valuesUpdated = false;
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
      // eslint-disable-next-line no-undef
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine)
    };

    if (!sessionStorage.caseData) {
      engine.dispatch(this.actions.logCaseStart());
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
  }

  updateCaseValues() {
    const { subjectInput, descriptionInput } = this.getInputs();
    if (
      this._caseData.subject !== subjectInput.value ||
      this._caseData.description !== descriptionInput.value
    ) {
      this._caseData = {
        ...this.sessionStorageCaseObject,
        subject: subjectInput.value,
        description: descriptionInput.value
      };
      sessionStorage.caseData = JSON.stringify(this._caseData);
      sessionStorage.valuesUpdated = true;
    }
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
    if (sessionStorage.caseData) {
      try {
        this.sessionStorageCaseObject = JSON.parse(sessionStorage.caseData);
      } catch (err) {
        this.sessionStorageCaseObject = {};
      }
    }
  }
}
