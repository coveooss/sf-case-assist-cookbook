import { LightningElement, api } from 'lwc';
import yourRequestWillNotBeSaved from '@salesforce/label/c.cookbook_YourRequestWillNotBeSaved';
import gladYouFoundAnswer from '@salesforce/label/c.cookbook_GladYouFoundAnswer';
import areYouSure from '@salesforce/label/c.cookbook_AreYouSure';
import close from '@salesforce/label/c.cookbook_Close';
import undo from '@salesforce/label/c.cookbook_Undo';
import confirm from '@salesforce/label/c.cookbook_Confirm';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';
import { NavigationMixin } from 'lightning/navigation';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */
/**
 * The `abandonModal` component is a modal that displays a message to confirm that the user wants to abandon his case.
 * @example
 * <c-abandon-modal engine-id={engineId} redirect-ref={redirectRef} header-label="We're glad you found the answer!"></c-abandon-modal>
 */
export default class AbandonModal extends NavigationMixin(LightningElement) {
  labels = {
    yourRequestWillNotBeSaved,
    gladYouFoundAnswer,
    close,
    undo,
    areYouSure,
    confirm
  };

  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The text to be displayed in the header of the modal.
   * @type {string}
   * @defaultValue `'We're glad you found the answer!'`
   */
  @api headerLabel = this.labels.gladYouFoundAnswer;
  /**
   * Object describing the type of page, its attributes, and the state of the page to redirect to when abandoning the case, more information in https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.use_navigate_basic
   * @type {object}
   */
  @api redirectRef = {
    type: 'standard__namedPage',
    attributes: {
      pageName: 'home'
    }
  };

  /** @type {CaseAssistEngine} */
  engine;
  /** @type {boolean} */
  _isOpen = false;

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  /**
   * @param {CaseAssistEngine} engine
   */
  initialize = (engine) => {
    this.engine = engine;

    this.actions = {
      // eslint-disable-next-line no-undef
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine)
    };
  };

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

  /**
   * Indicates whether the modal is open or not.
   * @returns {boolean}
   */
  @api get isOpen() {
    return this._isOpen;
  }

  confirm() {
    this.engine.dispatch(this.actions.logSolveCase());
    this[NavigationMixin.Navigate](this.redirectRef);
  }
}
