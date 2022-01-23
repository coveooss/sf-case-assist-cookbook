import { LightningElement, api } from 'lwc';
import { createCase as newCase } from 'c/caseUtils';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import createCase from '@salesforce/label/c.cookbook_CreateCase';

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
  labels = {
    createCase
  };

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

  get buttonClass() {
    return `slds-button slds-button_brand ${this.size === 'big' ? 'big' : ''}`;
  }

  get showLabel() {
    return !!this.label.length;
  }

  async handleCreateCase() {
    const newCaseId = await newCase(this.caseData);
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
