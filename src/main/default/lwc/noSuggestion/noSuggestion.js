import { LightningElement, api } from 'lwc';

/**
 * The "noSuggestion" component is the content we want to display when no suggestion has been found.
 * @example
 * <c-no-suggestion engine-id={engineId} case-data={caseData} disconnected-callback-action={disconnectedCallbackAction} ></c-no-suggestion>
 */
export default class NoSuggestion extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  /**
   * A JSON-serialized object representing the current case fields.
   * @type {string}
   */
  @api caseData;
  /**
   * The callback action to be triggered when disconnecting this component.
   * @type {function}
   */
  @api disconnectedCallbackAction;

  renderedCallback() {
    this.dispatchEvent(new CustomEvent('no_suggestions', { bubbles: true }));
  }

  disconnectedCallback() {
    if (this.disconnectedCallbackAction) {
      this.disconnectedCallbackAction();
    }
  }
}
