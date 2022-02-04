import { LightningElement, api } from 'lwc';
import { incrementScore } from 'c/ratingUtils';

export default class QuickviewFooter extends LightningElement {
  /**
   * list of ods of the components to hide.
   * @type {Array<string>}
   */
  @api slotsToBeHidden = [];

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
          source: 'quickview_footer',
          score: evt.detail === 'positive' ? 1 : 0
        },
        bubbles: true
      })
    );
  };

  renderedCallback() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._id = this.template.host.dataset.id;
      if (!this.slotsToBeHidden.includes(this._id)) {
        this.visible = true;
        this.dispatchEvent(
          new CustomEvent('show_action_slot', {
            detail: this._id,
            bubbles: true
          })
        );
      }
    }, 0);
  }
}
