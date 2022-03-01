import { LightningElement, api } from 'lwc';
import { incrementScore } from 'c/ratingUtils';

/**
 * The `voteTrackerWrapper` component is responsible of displaying the content of the actions slot of a document suggestion.
 * @example
 * <c-vote-tracker-wrapper engine-id={engineId}></c-vote-tracker-wrapper>
 */
export default class VoteTrackerWrapper extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;

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
