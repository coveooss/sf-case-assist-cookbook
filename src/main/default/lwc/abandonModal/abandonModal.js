import { LightningElement, api } from 'lwc';
import yourRequestWillNotBeSaved from '@salesforce/label/c.cookbook_YourRequestWillNotBeSaved';
import gladYouFoundAnswer from '@salesforce/label/c.cookbook_GladYouFoundAnswer';
import thankYouForFeedback from '@salesforce/label/c.cookbook_ThankYouForFeedback';
import close from '@salesforce/label/c.cookbook_Close';
import goToSite from '@salesforce/label/c.cookbook_GoToSite';
import closePage from '@salesforce/label/c.cookbook_ClosePage';
import undo from '@salesforce/label/c.cookbook_Undo';

/**
 * The `abandonModal` component is a modal that displays a message when the case is abandoned or canceled.
 * @example
 * <c-abandon-modal header-label="We're glad you found the answer!"></c-abandon-modal>
 */
export default class AbandonModal extends LightningElement {
  labels = {
    yourRequestWillNotBeSaved,
    gladYouFoundAnswer,
    thankYouForFeedback,
    close,
    closePage,
    goToSite,
    undo
  };

  /**
   * The text to be displayed in the header of the modal.
   * @type {string}
   * @defaultValue `'We're glad you found the answer!'`
   */
  @api headerLabel = this.labels.gladYouFoundAnswer;

  /** @type {boolean} */
  _isOpen = false;

  /**
   * Returns the CSS class of the modal.
   * @returns {string}
   */
  get modalClass() {
    return `slds-modal slds-modal_small ${
      this._isOpen ? 'slds-fade-in-open' : ''
    }`;
  }

  /**
   * Returns the CSS class of the backdrop.
   * @returns {string}
   */
  get backdropClass() {
    return `slds-backdrop ${this._isOpen ? 'slds-backdrop_open' : ''} `;
  }

  /**
   * Opens the modal.
   * @returns {void}
   */
  @api openModal() {
    this._isOpen = true;
  }

  /**
   * Closes the modal.
   * @returns {void}
   */
  @api closeModal() {
    this._isOpen = false;
  }

  @api get isOpen() {
    return this._isOpen;
  }

  goToSite() {
    // Placeholder for navigation to site.
  }
}
