import { api, LightningElement } from 'lwc';
import logIn from '@salesforce/label/c.cookbook_LogIn';
import describeProblem from '@salesforce/label/c.cookbook_DescribeProblem';
import provideDetails from '@salesforce/label/c.cookbook_ProvideDetails';
import reviewHelp from '@salesforce/label/c.cookbook_ReviewHelp';

/**
 * @typedef ProgressStep
 * @type {Object}
 * @property {String} value
 * @property {String} label
 */

/** @type {ProgressStep[]} */
const DEFAULT_STEPS = [
  {
    label: logIn,
    value: 'login'
  },
  {
    label: describeProblem,
    value: 'describe'
  },
  {
    label: provideDetails,
    value: 'details'
  },
  {
    label: reviewHelp,
    value: 'review'
  }
];

/**
 * The `flowProgressIndicator` component is a dynamic indicator that shows the progress in the different steps of the flow.
 * @example
 * <flow-progress-indicator steps={customSteps}></flow-progress-indicator>
 */
export default class FlowProgressIndicator extends LightningElement {
  /** @type {ProgressStep[]} */
  @api steps = DEFAULT_STEPS;

  /** @type {number}  */
  _currentStepIdx = 0;
  /** @type {boolean} */
  _hasError = false;

  /**
   * Set the current step index value.
   * @param {number} idx - the index value of the step to be set.
   * @returns {void}
   */
  @api set currentStepIdx(idx) {
    this._currentStepIdx = idx;
  }

  /**
   * Returns the current step index value.
   * @returns {number}
   */
  get currentStepIdx() {
    return this._currentStepIdx;
  }

  /** Returns the current step value */
  get currentStep() {
    return this.steps[this.currentStepIdx].value || 0;
  }

  /**
   * Set the error state of the component.
   * @param {boolean} state - the value to be set.
   * @returns {void}
   */
  @api set hasError(state) {
    this._hasError = state;
  }

  /**
   * Returns the error state of the component.
   * @returns {boolean}
   */
  get hasError() {
    return this._hasError;
  }
}
