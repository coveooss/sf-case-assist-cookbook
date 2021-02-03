import { LightningElement, api, track } from 'lwc';

export default class CaseAssistSuggestions extends LightningElement {
  /**
   * The name of the field you are providing suggestions for.
   * It is used to emit the selected event when a suggestion gets selected.
   */
  @api fieldName;

  @track _suggestions = [];

  handleSuggestionClick(event) {
    const eventData = {
      fieldName: this.fieldName,
      value: event.target.label,
      confidence: event.target.dataset.confidence,
      id: event.target.dataset.id
    };
    this.dispatchEvent(new CustomEvent('selected', { detail: eventData }));
  }

  /**
   * A list of suggestions to display.
   */
  @api
  get suggestions() {
    return this._suggestions;
  }

  set suggestions(suggestions) {
    this._suggestions = suggestions;
  }
}
