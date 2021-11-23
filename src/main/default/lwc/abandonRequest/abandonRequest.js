import { LightningElement, api } from 'lwc';
import abandonRequestText from '@salesforce/label/c.cookbook_AbandonRequest';

/**
 * The `abandonRequest` component is a button to abandon a case creation request.
 * @example
 * <c-abandon-request  label="Abandon request" timeout="2000"></c-abandon-request>
 */
export default class AbandonRequest extends LightningElement {
  labels = {
    abandonRequestText
  };

  /**
   * The label to be shown in the button to abandon a request.
   * @api
   * @type {string}
   */
  @api label = this.labels.abandonRequestText;

  /**
   * Handles the click on the abandon request button.
   * @returns {void}
   */
  handleAbandon() {
    this.dispatchEvent(new CustomEvent('abandon'));
  }
}
