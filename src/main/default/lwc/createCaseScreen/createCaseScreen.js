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
import provideDetailsTitle from '@salesforce/label/c.cookbook_ProvideDetailsTitle';
import provideDetailsSubtitle from '@salesforce/label/c.cookbook_ProvideDetailsSubtitle';
import priority from '@salesforce/label/c.cookbook_PriorityLabel';
import reason from '@salesforce/label/c.cookbook_ReasonLabel';
import typeLabel from '@salesforce/label/c.cookbook_TypeLabel';
import moreOptions from '@salesforce/label/c.cookbook_MoreOptions';
import reviewResources from '@salesforce/label/c.cookbook_ReviewResources';
import describeProblem from '@salesforce/label/c.cookbook_DescribeProblem';
import logIn from '@salesforce/label/c.cookbook_LogIn';

/**
 * @typedef ProgressStep
 * @type {Object}
 * @property {String} value
 * @property {String} label
 */

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class CreateCaseScreen extends LightningElement {
  labels = {
    describeProblemTitle,
    next,
    priority,
    reason,
    typeLabel,
    provideDetailsTitle,
    provideDetailsSubtitle,
    moreOptions,
    reviewResources,
    describeProblem,
    logIn,
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
  /** @type{object} */
  _caseData = {};
  /** @type {object} */
  sessionStorageCaseObject = {};
  /** @type {ProgressStep[]} */
  customSteps = [
    {
      label: this.labels.logIn,
      value: 'log in'
    },
    {
      label: this.labels.describeProblem,
      value: 'describe problem'
    },
    {
      label: this.labels.reviewResources,
      value: 'review resources'
    }
  ];

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
    try {
      if (this.caseData) {
        this._caseData = JSON.parse(this.caseData);
      }
      this.extractDataFromSessionStorage();
    } catch (err) {
      console.warn('Failed to parse the flow variable caseData', err);
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

  updateCaseValues() {
    const {
      subjectInput,
      descriptionInput,
      priorityInput,
      typeInput,
      reasonInput
    } = this.getInputs();
    this._caseData = {
      subject: subjectInput.value,
      description: descriptionInput.value,
      priority: priorityInput.value,
      type: typeInput.value,
      reason: reasonInput.value
    };
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

  inputValidity() {
    const {
      subjectInput,
      descriptionInput,
      priorityInput,
      typeInput,
      reasonInput
    } = this.getInputs();
    const inputs = [subjectInput, priorityInput, typeInput, reasonInput];
    inputs.forEach((input) => {
      input.reportValidity();
    });
    descriptionInput.validate();
    return (
      descriptionInput.validity &&
      inputs.reduce(
        (previousValidity, input) => previousValidity && !input.hasError,
        true
      )
    );
  }

  getInputs() {
    const subjectInput = this.template.querySelector('c-subject-input');
    const descriptionInput = this.template.querySelector('c-description-input');
    const priorityInput = this.template.querySelector(
      'c-quantic-case-classification[title="priority"]'
    );
    const reasonInput = this.template.querySelector(
      'c-quantic-case-classification[title="reason"]'
    );
    const typeInput = this.template.querySelector(
      'c-quantic-case-classification[title="type"]'
    );
    return {
      subjectInput,
      descriptionInput,
      priorityInput,
      reasonInput,
      typeInput
    };
  }

  extractDataFromSessionStorage() {
    if (sessionStorage.caseData) {
      try {
        this.sessionStorageCaseObject = JSON.parse(sessionStorage.caseData);
      } catch (err) {
        console.warn('Failed to parse the case object', err);
        this.sessionStorageCaseObject = {};
      }
    }
  }
}
