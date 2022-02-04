import { LightningElement, api } from 'lwc';
import { incrementScore } from 'c/ratingUtils';

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
      new CustomEvent('rating_saved', {
        detail: { id: this._id, type: evt.detail, source: 'actions' },
        bubbles: true,
        composed: true
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
