import { LightningElement, api } from 'lwc';
import { getScore } from 'c/ratingUtils';

/**
 * The `voteCountWrapper` component is responsible for retrieving the rating score of a document suggestion and passing it to the voteCount component.
 * @example
 * <c-vote-count-wrapper></cc-vote-count-wrapper>
 */
export default class VoteCountWrapper extends LightningElement {
  /** @type {string} */
  _id;
  /** @type {number} */
  score;
  /** @type {boolean} */
  active;
  /** @type {array} */
  idsPreviouslyVotedPositive = [];

  @api incrementScore() {
    this.score++;
    this.active = true;
  }

  @api getId() {
    return this._id;
  }

  votePreviouslyClickedPositve(id) {
    if (!sessionStorage.idsPreviouslyVotedPositive) {
      return false;
    }
    try {
      this.idsPreviouslyVotedPositive = JSON.parse(
        sessionStorage.idsPreviouslyVotedPositive
      );
      return this.idsPreviouslyVotedPositive.includes(id);
    } catch (err) {
      console.warn('Failed to parse the idsPreviouslyVotedPositive array', err);
      return false;
    }
  }

  renderedCallback() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(async () => {
      if (!this._id) {
        this._id = this.template.host.dataset.id;
        this.score = await getScore(this._id);
        if (this.votePreviouslyClickedPositve(this._id)) {
          this.active = true;
        }
      }
    }, 0);
  }
}
