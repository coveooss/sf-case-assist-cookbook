import { LightningElement, api } from 'lwc';
import voteQuestion from '@salesforce/label/c.cookbook_VoteQuestion';
import vote from '@salesforce/label/c.cookbook_VoteLabel';
import voteFinalText from '@salesforce/label/c.cookbook_VoteFinalText';
import abandonRequestText from '@salesforce/label/c.cookbook_AbandonRequest';
import yes from '@salesforce/label/c.cookbook_Yes';
import no from '@salesforce/label/c.cookbook_No';

/**
 * The `voteTracker` component is a button to share whether a document was helpful or not. Also sends a signal to Coveo platform for ML.
 * @example
 * <c-vote-tracker size="small" label="Your feedback can help others" question="Did you find this helpful?" final-nessage="Thank you" abandon-label="Abandon request" timeout="2000"></c-vote-tracker>
 */
export default class VoteTracker extends LightningElement {
  labels = {
    voteFinalText,
    vote,
    voteQuestion,
    abandonRequestText,
    yes,
    no
  };
  /**
   * The label to be shown to the user.
   * @api
   * @type {string}
   */
  @api label = this.labels.vote;

  /**
   * The question to be shown to the user.
   * @api
   * @type {string}
   */
  @api question = this.labels.voteQuestion;

  /**
   * The size of the component.
   * @api
   * @type {'small'|'big'}
   */
  @api size = 'small';

  /**
   * The text to be shown after the vote.
   * @api
   * @type {string}
   */
  @api finalText = this.labels.voteFinalText;

  /**
   * The label to be shown in the button to abandon a request.
   * @api
   * @type {string}
   */
  @api abandonLabel = this.labels.abandonRequestText;

  /**
   * The timeout to wait before showing the final state after voting.
   * @type {number}
   */
  timeout = 2000;

  /**
   * Tells if the component is on the final state that appears after voting.
   * @type {boolean}
   */
  _finalState = false;

  /**
   * @type {'initial'|'positive'|'negative'}
   */
  _votingState = 'initial';

  /**
   * Preperty used to store the timeouts to give the possiblity of clearing them.
   */
  _timer = null;

  /**
   * Returns the CSS class to be given to the question.
   * @returns {string}
   */
  get questionClass() {
    return this.size === 'small'
      ? 'slds-text-title_bold text_light'
      : 'slds-text-heading_small';
  }

  /**
   * Tells if the abandon request button should be shown.
   * @returns {boolean}
   */
  get showAbandonRequest() {
    return this.size === 'big' && this._votingState === 'positive';
  }

  /**
   * Tells if the component is in the final state.
   * @returns {boolean}
   */
  @api
  get finalState() {
    return this._finalState;
  }

  /**
   * Tells if the the size of the component is big.
   * @returns {boolean}
   */
  get isBig() {
    return this.size === 'big';
  }

  /**
   * Returns the state of the positive vote button.
   * @returns {'initial'|'selected'|'neutral'}
   */
  get positiveState() {
    if (this._votingState === 'initial') {
      return this._votingState;
    }
    return this._votingState === 'positive' ? 'selected' : 'neutral';
  }

  /**
   * Returns the state of the negative vote button.
   * @returns {'initial'|'selected'|'neutral'}
   */
  get negativeState() {
    if (this._votingState === 'initial') {
      return this._votingState;
    }
    return this._votingState === 'negative' ? 'selected' : 'neutral';
  }

  /**
   * Handles the click on the positive vote button.
   * @returns {void}
   */
  positiveVote() {
    this._votingState = 'positive';
    clearTimeout(this._timer);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this._timer = setTimeout(() => {
      this._finalState = true;
      this.dispatchEvent(
        new CustomEvent('rating_clicked', {
          detail: 'positive',
          bubbles: true
        })
      );
    }, this.timeout);
  }

  /**
   * Handles the click on the negative vote button.
   * @returns {void}
   */
  negativeVote() {
    this._votingState = 'negative';
    clearTimeout(this._timer);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this._timer = setTimeout(() => {
      this._finalState = true;
      this.dispatchEvent(
        new CustomEvent('rating_clicked', {
          detail: 'negative',
          bubbles: true
        })
      );
    }, this.timeout);
  }
}
