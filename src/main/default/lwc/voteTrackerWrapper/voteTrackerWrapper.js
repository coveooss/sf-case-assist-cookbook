import { LightningElement, api } from 'lwc';
import { incrementScore } from 'c/ratingUtils';

/**
 * The `voteTrackerWrapper` component is responsible of displaying or not the content of the actions slot of a document suggestion.
 * @example
 * <c-vote-tracker-wrapper></c-vote-tracker-wrapper>
 */
export default class VoteTrackerWrapper extends LightningElement {
  /** @type {visible}*/
  visible = false;
  /** @type {string} */
  _id;

  connectedCallback() {
    this.template.addEventListener('rating_clicked', this.onRatingClick);
  }

  onRatingClick = async (evt) => {
    if (evt.detail === 'positive') {
      await incrementScore(this._id);
    }
    this.dispatchEvent(
      new CustomEvent('rating', {
        detail: {
          id: this._id,
          type: evt.detail,
          source: 'actions',
          score: evt.detail === 'positive' ? 1 : 0
        },
        bubbles: true
      })
    );
  };

  renderedCallback() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      if (!this._id) {
        this._id = this.template.host.dataset.id;
      }
    }, 0);
  }

  @api hide() {
    this.visible = false;
  }
  @api show() {
    this.visible = true;
  }
}
