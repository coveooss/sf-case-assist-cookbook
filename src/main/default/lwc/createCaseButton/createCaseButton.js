import { LightningElement, api } from 'lwc';
import { createCase } from 'c/ratingUtils';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

/**
 * @typedef CaseData
 * @type {Object}
 * @property {String} subject
 * @property {String} description
 * @property {String} priority
 * @property {String} origin
 * @property {String} reason
 */

export default class CreateCaseButton extends LightningElement {
  /**
   * @type {CaseData}
   */
  @api caseData;
  /**
   * The size of the button
   * @type {'small'|'big'}
   */
  @api size = 'big';
  /**
   * The label of the button
   * @type {string}
   */
  @api label = '';
  /**
   * @type {string}
   */
  @api buttonLabel = 'Create case';

  get buttonClass() {
    return `slds-button slds-button_brand ${this.size === 'big' ? 'big' : ''}`;
  }

  async handleCreateCase() {
    const newCaseId = await createCase(this.caseData);
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
