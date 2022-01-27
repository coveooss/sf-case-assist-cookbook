import { api, LightningElement } from 'lwc';
import logIn from '@salesforce/label/c.cookbook_LogIn';
import describeProblem from '@salesforce/label/c.cookbook_DescribeProblem';
import provideDetails from '@salesforce/label/c.cookbook_ProvideDetails';
import reviewResources from '@salesforce/label/c.cookbook_ReviewResources';

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
    value: 'log in'
  },
  {
    label: describeProblem,
    value: 'describe problem'
  },
  {
    label: provideDetails,
    value: 'provide details'
  },
  {
    label: reviewResources,
    value: 'review resources'
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

  /** @type {boolean} */
  _hasError = false;
  /** @type {string} */
  _currentStep;

  /**
   * Set the error state of the component.
   * @param {boolean} state - the state to be set.
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

  /**
   * Set the current step of the component.
   * @param {string} value - the value to be set.
   * @returns void
   */
  @api set currentStep(value) {
    if (!this.stepExists(value)) {
      console.error(`No steps found with value '${value}'`);
      this._currentStep = null;
    } else {
      this._currentStep = value;
    }
  }

  /**
   * Get the current step of the component.
   * @returns {string| null}
   */
  get currentStep() {
    return this.stepExists(this._currentStep) ? this._currentStep : null;
  }

  /**
   * Indicates whether a given step exists or not.
   * @param {string} value - the value of the given step.
   * @returns {boolean}
   */
  stepExists(value) {
    return this.steps.some((step) => step.value === value);
  }
}
