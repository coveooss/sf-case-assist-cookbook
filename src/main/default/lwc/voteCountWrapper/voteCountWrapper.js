import { LightningElement, api } from 'lwc';
import { getScore } from 'c/ratingUtils';

export default class VoteCountWrapper extends LightningElement {
  /** @type {string} */
  _id;
  /** @type {number} */
  score;
  /** @type {boolean} */
  active;

  @api incrementScore() {
    this.score++;
    this.active = true;
  }

  @api getId() {
    return this._id;
  }

  renderedCallback() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(async () => {
      if (!this._id) {
        this._id = this.template.host.dataset.id;
        this.score = await getScore(this._id);
      }
    }, 0);
  }
}
