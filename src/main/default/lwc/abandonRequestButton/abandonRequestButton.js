/* eslint-disable no-undef */
import { LightningElement, api } from 'lwc';
import abandonRequest from '@salesforce/label/c.cookbook_AbandonRequest';

/**
 * The `abandonRequest` component is a button to abandon a case creation request.
 * @example
 * <c-abandon-request-button engine-id={engineId} button-label="Abandon request" label="Solved your problem" size="big"></c-abandon-request-button>
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
  /**
   * Object describing the type of page, its attributes, and the state of the page to redirect to when abandoning the case, more information in https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.use_navigate_basic
   * @type {object}
   */
  @api redirectRef = {
    type: 'standard__namedPage',
    attributes: {
      pageName: 'home'
    }
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
    const modal = this.template.querySelector('c-abandon-modal');
    modal.openModal();
  }
}
