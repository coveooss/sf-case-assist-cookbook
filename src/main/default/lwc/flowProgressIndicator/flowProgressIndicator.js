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
 * <flow-progress-indicator current-step-index="0" steps={customSteps}></flow-progress-indicator>
 */
export default class FlowProgressIndicator extends LightningElement {
  /** @type {ProgressStep[]} */
  @api steps = DEFAULT_STEPS;

  /**
   * The index value OF the current step.
   * @type {number}
   * @defaultValue `0`
   */
  @api currentStepIndex = 0;

  /** @type {boolean} */
  _hasError = false;

  /** Returns the value of current step. */
  get currentStep() {
    return this.steps[this.currentStepIndex].value || 0;
  }

  /**
   * Set the error state of the component.
   * @param {boolean} state - the value to be set.
   * @returns {void}
   */
  @api triggerError(state) {
    this._hasError = state;
  }

  /**
   * Returns the error state of the component.
   * @returns {boolean}
   */
  @api get hasError() {
    return this._hasError;
  }
}
