import { LightningElement, api } from 'lwc';

export default class NoSuggestion extends LightningElement {
  /**
   * A stringified object representing the current fields set on the case.
   * @type {string}
   */
  @api caseData;
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  @api disconnectedCallbackAction;

  renderedCallback() {
    this.dispatchEvent(new CustomEvent('no_suggestions', { bubbles: true }));
  }

  async disconnectedCallback() {
    if (this.disconnectedCallbackAction) {
      this.disconnectedCallbackAction();
    }
  }
}
