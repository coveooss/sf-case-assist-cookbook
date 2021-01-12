import { LightningElement, track, api } from 'lwc';

export default class DocumentsResultList extends LightningElement {
  @track _results = [];

  /**
   * The Coveo results to display in the result list.
   * The current example uses the { title, clickUri, excerpt, uniqueId } to render the result.
   */
  @api
  get results() {
    return this._results || [];
  }

  set results(results) {
    this._results = results;
  }

  handleResultClick(event) {
    const clickedIndex = parseInt(event.target.dataset.index, 10);
    const resultClicked = this._results[clickedIndex];
    const resultClickedEvent = new CustomEvent('resultclicked', {
      detail: { ...resultClicked, rank: clickedIndex }
    });
    this.dispatchEvent(resultClickedEvent);
  }

  likeResult() {
    // TODO: Send a like event.
  }

  dislikeResult() {
    // TODO: Send a dislike event.
  }
}
