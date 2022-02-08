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
import origin from '@salesforce/label/c.cookbook_OriginLabel';
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
    origin,
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
   * A stringified object representing the current fields set on the case.
   * @type {string}
   */
  @api caseData;

  /** @type {CaseAssistEngine} */
  engine;
  /** @type {object} */
  theCase;
  /** @type {string} */
  subject = '';
  /** @type {string} */
  description = '';
  /** @type {string} */
  priority = '';
  /** @type {string} */
  origin = '';
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
    this.extractDataFromSessionStorage();
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
    }
  }

  getCaseValues() {
    const {
      subjectInput,
      descriptionInput,
      priorityInput,
      originInput
    } = this.getInputs();
    this.theCase = {
      subject: subjectInput.value,
      description: descriptionInput.value,
      priority: priorityInput.value,
      origin: originInput.value
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
  }

  inputValidity() {
    const {
      subjectInput,
      descriptionInput,
      priorityInput,
      originInput
    } = this.getInputs();
    const inputs = [subjectInput, priorityInput, originInput];
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
    const originInput = this.template.querySelector(
      'c-quantic-case-classification[title="origin"]'
    );
    return {
      subjectInput,
      descriptionInput,
      priorityInput,
      originInput
    };
  }

  extractDataFromSessionStorage() {
    if (sessionStorage.previousNavigation && sessionStorage.caseData) {
      const sessionStorageObject = JSON.parse(sessionStorage.caseData);
      this.subject = sessionStorageObject.subject;
      this.description = sessionStorageObject.description;
    }
  }
}
