import { LightningElement, api } from 'lwc';
import { incrementScore } from 'c/ratingUtils';

/**
 * The `quickviewFooterWrapper` component is responsible of displaying the content of a quickview footer of a document suggestion.
 * @example
 * <c-quickview-footer-wrapper engine-id={engineId} slots-to-be-hidden={slotsToBeHidden}></c-quickview-footer-wrapper>
 */
export default class QuickviewFooterWrapper extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  /**
   * List of IDs of the document suggestions that  don't need this component to be displayed in them.
   * @type {Array<string>}
   */
  @api slotsToBeHidden = [];

  /** @type {boolean}*/
  visible = false;
  /** @type {string} */
  _id;
  /** @type {array} */
  idsPreviouslyVoted;

  connectedCallback() {
    this.template.addEventListener('rating_clicked', this.onRatingClick);
  }

  onRatingClick = async (evt) => {
    if (evt.detail === 'positive') {
      incrementScore(this._id);
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

  votePreviouslyClicked(id) {
    if (!sessionStorage.idsPreviouslyVoted) {
      return false;
    }
    try {
      this.idsPreviouslyVoted = JSON.parse(sessionStorage.idsPreviouslyVoted);
      return this.idsPreviouslyVoted.includes(id);
    } catch (err) {
      console.warn('Failed to parse the idsPreviouslyVoted array', err);
      return false;
    }
  }

  renderedCallback() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._id = this.template.host.dataset.id;
      if (
        !this.votePreviouslyClicked(this._id) &&
        !this.slotsToBeHidden.includes(this._id)
      ) {
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
