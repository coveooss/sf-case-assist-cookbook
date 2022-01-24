import { LightningElement, api } from 'lwc';
import { createCase as newCase } from 'c/caseUtils';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import createCase from '@salesforce/label/c.cookbook_CreateCase';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

/**
 * @typedef CaseData
 * @type {Object}
 * @property {String} subject
 * @property {String} description
 * @property {String} priority
 * @property {String} origin
 * @property {String} reason
 */

/**
 * The `createCaseButton` component is a button to submit the create of a case.
 * @example
 * <c-create-case-button eingine-id={engineId} button-label="Create case" label="Still need help" size="big"></c-create-case-button>
 */
export default class CreateCaseButton extends LightningElement {
  labels = {
    createCase
  };

  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * @type {CaseData}
   */
  @api caseData;
  /**
   * The size of the button.
   * @type {'small'|'big'}
   */
  @api size = 'big';
  /**
   * The label displayed above the button.
   * @type {string}
   */
  @api label = '';
  /**
   * The label displayed inside the button.
   * @type {string}
   */
  @api buttonLabel = this.labels.createCase;

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
  };

  get buttonClass() {
    return `slds-button slds-button_brand ${this.size === 'big' ? 'big' : ''}`;
  }

  get showLabel() {
    return !!this.label.length;
  }

  async handleCreateCase() {
    const newCaseId = await newCase(this.caseData);
    if (newCaseId) {
      this.engine.dispatch(this.actions.logCreateCase(newCaseId));
      const attributeChangeEvent = new FlowAttributeChangeEvent(
        'recordId',
        newCaseId
      );
      const customEvent = new CustomEvent('next', {
        bubbles: true
      });
      this.dispatchEvent(attributeChangeEvent);
      this.dispatchEvent(customEvent);
    }
  }
}
