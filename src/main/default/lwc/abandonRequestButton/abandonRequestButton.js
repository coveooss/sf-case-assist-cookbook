import { LightningElement, api } from 'lwc';
import abandonRequestText from '@salesforce/label/c.cookbook_AbandonRequest';

/**
 * The `abandonRequest` component is a button to abandon a case creation request.
 * @example
 * <c-abandon-request  label="Abandon request"></c-abandon-request>
 */
export default class AbandonRequest extends LightningElement {
  labels = {
    abandonRequestText
  };

  /**
   * The label to be shown in the button to abandon a request.
   * @type {string}
   */
  @api label = '';
  /**
   * The size of the button
   * @type {'small'|'big'}
   */
  @api size = 'big';
  /**
   * The label to be shown in the button to abandon a request.
   * @type {string}
   */
  @api buttonLabel = this.labels.abandonRequestText;

  get buttonClass() {
    return `slds-button slds-button_outline-brand ${
      this.size === 'big' ? 'big' : ''
    }`;
  }

  /**
   * Handles the click on the abandon request button.
   * @returns {void}
   */
  handleAbandon() {
    const modal = this.template.querySelector('c-abandon-modal');
    modal.openModal();
    this.dispatchEvent(new CustomEvent('abandon'));
  }
}
