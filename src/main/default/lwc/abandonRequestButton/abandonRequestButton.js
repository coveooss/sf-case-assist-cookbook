/* eslint-disable no-undef */
import { LightningElement, api } from 'lwc';
import abandonRequest from '@salesforce/label/c.cookbook_AbandonRequest';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

/**
 * The `abandonRequest` component is a button to abandon a case creation request.
 * @example
 * <c-abandon-request-button button-label="Abandon request" label="Solved your problem" size="big"></c-abandon-request-button>
 */
export default class AbandonRequestButton extends LightningElement {
  labels = {
    abandonRequest
  };

  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The label dislayed above the button.
   * @type {string}
   */
  @api label = '';
  /**
   * The size of the button
   * @type {'small'|'big'}
   */
  @api size = 'big';
  /**
   * The label displayed inside the button.
   * @type {string}
   */
  @api buttonLabel = this.labels.abandonRequest;

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
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine)
    };
  };

  get buttonClass() {
    return `slds-button slds-button_outline-brand ${
      this.size === 'big' ? 'big' : ''
    }`;
  }

  get showLabel() {
    return !!this.label.length;
  }

  /**
   * Handles the click on the abandon request button.
   * @returns {void}
   */
  handleAbandon() {
    this.engine.dispatch(this.actions.logAbandonCase('Solved'));
    const modal = this.template.querySelector('c-abandon-modal');
    modal.openModal();
  }
}
