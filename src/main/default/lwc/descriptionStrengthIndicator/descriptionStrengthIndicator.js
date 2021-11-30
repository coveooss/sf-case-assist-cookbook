import { LightningElement, api } from 'lwc';
import thankYou from '@salesforce/label/c.cookbook_ThankYou';
import provideDetails from '@salesforce/label/c.cookbook_ProvideDetails';
import provideMoreDetails from '@salesforce/label/c.cookbook_ProvideMoreDetails';
import dontKnowWhatToWrite from '@salesforce/label/c.cookbook_DontKnowWhatToWrite';
import descriptionHintOne from '@salesforce/label/c.cookbook_DescriptionHintOne';
import descriptionHintTwo from '@salesforce/label/c.cookbook_DescriptionHintTwo';
import descriptionHintThree from '@salesforce/label/c.cookbook_DescriptionHintThree';

/**
 * The `descriptionStrengthIndicator` component is a dynamic indicator that shows the user if his case description has enough details so far. It also gives hints to the user as to what information they should include in the description.
 * @example
 * <c-description-strength-indicator initial-message="Provide details" help-label="Don't know what to write?" keep-going-message="Provide more details" keep-going-threshold="75" final-message="Thank you!"></c-description-strength-indicator>
 */
export default class DescriptionStrengthIndicator extends LightningElement {
  labels = {
    thankYou,
    provideDetails,
    provideMoreDetails,
    dontKnowWhatToWrite,
    descriptionHintOne,
    descriptionHintTwo,
    descriptionHintThree
  };

  /**
   * The label to be shown to the user.
   * @type {string}
   * @defaultValue `'Don't know what to write?'`
   */
  @api helpLabel = this.labels.dontKnowWhatToWrite;

  /**
   * The initial message to be shown to the user.
   * @type {string}
   * @defaultValue `'Provide details'`
   */
  @api initialMessage = this.labels.provideDetails;

  /**
   * The message to be shown to encourage the user to keep going.
   * @type {string}
   * @defaultValue `'Provide more details'`
   */
  @api keepGoingMessage = this.labels.provideMoreDetails;

  /**
   * The progress value from where the keepGoingMessage will be shown.
   * @type {number}
   * @defaultValue `75`
   */
  @api keepGoingThreshold = 75;

  /**
   * The final message to be shown to the user when the progress indicator is full.
   * @type {string}
   * @defaultValue `'Thank you!'`
   */
  @api finalMessage = this.labels.thankYou;

  /** @type {number} */
  _progress = 0;

  /**
   * Returns the message to be shown to the user.
   * @returns {string}
   */
  get message() {
    if (this.isFull) {
      return this.finalMessage;
    } else if (
      this.keepGoingThreshold > 0 &&
      this._progress >= this.keepGoingThreshold
    ) {
      return this.keepGoingMessage;
    }
    return this.initialMessage;
  }

  /**
   * Set the progress value.
   * @param {number} progress - the progress value to be set.
   * @returns {void}
   */
  @api set progress(progress) {
    this._progress = Math.max(Math.min(progress, 100), 0);
  }

  /**
   * Returns the progress value.
   * @returns {number}
   */
  get progress() {
    return this._progress;
  }

  /**
   * Tells if the progress indicator is full.
   * @returns {boolean}
   */
  @api get isFull() {
    return this._progress === 100;
  }

  /**
   * Returns the path of the svg showing the progress.
   * @returns {string}
   */
  get progressPath() {
    const isLong = this._progress > 50 ? 1 : 0;
    const arcX = Math.cos(2 * Math.PI * (this._progress / 100)).toFixed(2);
    const arcY = -Math.sin(2 * Math.PI * (this._progress / 100)).toFixed(2);
    return `M 1 0 A 1 1 0 ${isLong} 0 ${arcX} ${arcY} L 0 0`;
  }
}
