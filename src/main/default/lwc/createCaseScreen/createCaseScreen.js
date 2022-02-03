import { LightningElement, api } from 'lwc';
import {
  FlowNavigationNextEvent,
  FlowAttributeChangeEvent
} from 'lightning/flowSupport';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';
import describeProblemTitle from '@salesforce/label/c.cookbook_DescribeProblemTitle';
import next from '@salesforce/label/c.cookbook_Next';
import provideDetailsTitle from '@salesforce/label/c.cookbook_ProvideDetailsTitle';
import provideDetailsSubtitle from '@salesforce/label/c.cookbook_ProvideDetailsSubtitle';
import priority from '@salesforce/label/c.cookbook_PriorityLabel';
import typeLabel from '@salesforce/label/c.cookbook_TypeLabel';
import origin from '@salesforce/label/c.cookbook_OriginLabel';
import moreOptions from '@salesforce/label/c.cookbook_MoreOptions';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class CreateCaseScreen extends LightningElement {
  labels = {
    describeProblemTitle,
    next,
    priority,
    typeLabel,
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
  /** @type {string} */
  priority = '';
  /** @type {string} */
  type = '';
  /** @type {string} */
  origin = '';

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
      sessionStorage.caseData = this._caseData;
    }
  }

  getCaseValues() {
    const {
      subjectInput,
      descriptionInput,
      priorityInput,
      typeInput,
      originInput
    } = this.getInputs();
    this.theCase = {
      subject: subjectInput.value,
      description: descriptionInput.value,
      priority: priorityInput.value,
      type: typeInput.value,
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
      typeInput,
      originInput
    } = this.getInputs();
    const inputs = [subjectInput, priorityInput, typeInput, originInput];
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
    const typeInput = this.template.querySelector(
      'c-quantic-case-classification[title="type"]'
    );
    const originInput = this.template.querySelector(
      'c-quantic-case-classification[title="origin"]'
    );
    return {
      subjectInput,
      descriptionInput,
      priorityInput,
      typeInput,
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
