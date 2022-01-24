import { LightningElement, api } from 'lwc';
import next from '@salesforce/label/c.cookbook_Next';
import previous from '@salesforce/label/c.cookbook_Previous';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

/**
 * The `navigationButton` is a button to navigate through the steps of the case creation process.
 * @example
 * <c-navigation-button type="next" show-icon label="Next"></navigation-button>
 */
export default class NavigationButton extends LightningElement {
  labels = {
    next,
    previous
  };

  /**
   * The ID of the case assist engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The type of the navigation button.
   * @type {'next'|'previous'}
   * @defaultValue `'next'`
   */
  @api type = 'next';
  /**
   * The label given to the navigation button.
   * @type {string}
   * @defaultValue `''`
   */
  @api label = '';
  /**
   * Tells if an icon should be displayed with the button.
   * @type {boolean}
   * @defaultValue `false`
   *
   */
  @api showIcon = false;

  /** @type {CaseAssistEngine} */
  engine;

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
   * Returns the label to be shown in the navigation button.
   * @returns { string }
   */
  get shownLabel() {
    if (this.label) {
      return this.label;
    }
    return this.type === 'next' ? this.labels.next : this.labels.previous;
  }

  /**
   * Returns the CSS class of the icon.
   * @returns {string}
   */
  get buttonClass() {
    return `slds-button ${this.type === 'next' ? 'slds-button_brand big' : ''}`;
  }

  get showNextIcon() {
    return this.showIcon && this.type === 'next';
  }

  get showPreviousIcon() {
    return this.showIcon && this.type === 'previous';
  }

  /**
   * Handles clicks on the navigation button.
   * @returns {void}
   */
  handleNavigate() {
    if (this.type === 'next') {
      this.dispatchEvent(new CustomEvent('next', { bubbles: true }));
      this.engine.dispatch(this.actions.logCaseNextStage());
    } else {
      this.dispatchEvent(new CustomEvent('previous', { bubbles: true }));
    }
  }
}
