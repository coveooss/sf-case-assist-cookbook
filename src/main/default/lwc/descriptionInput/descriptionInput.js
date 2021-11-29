import { LightningElement, api } from 'lwc';
import explainProblem from '@salesforce/label/c.cookbook_DescriptionInputTitle';
import errorValueMissing from '@salesforce/label/c.cookbook_ValueMissing';

/**
 * The `descriptionInput` component displays a rich text input for the case description.
 * @example
 * <c-description-input label="Explain the problem" messageWhenValueMissing="Complete this field." required></c-description-input>
 */
export default class DescriptionInput extends LightningElement {
  labels = {
    explainProblem,
    errorValueMissing
  };

  /**
   * The label to be shown to the user.
   * @type {string}
   * @defaultValue `'Explain the problem'`
   */
  @api label = this.labels.explainProblem;

  /**
   * Tells if the input is required.
   * @type {boolean}
   * @defaultValue `false`
   */
  @api required = false;

  /**
   * The error message to be shown when the value is missing.
   * @type {string}
   * @defaultValue `'Complete this field.`
   */
  @api messageWhenValueMissing = this.labels.errorValueMissing;

  /** @type {string} */
  _value = '';

  /** @type {string} */
  _errorMessage = '';

  /**
   * List of formats to include in the editor.
   * @type {Array<string>}
   */
  @api formats = [
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'indent',
    'clean',
    'table',
    'header'
  ];

  /**
   * Returns the error message to be shown.
   * @type {string}
   */
  get errorMessage() {
    return this._errorMessage;
  }

  /**
   * Returns the CSS class of the form.
   * @returns {string}
   */
  get formClass() {
    return `slds-form-element ${this.hasError ? 'slds-has-error' : ''}`;
  }

  /**
   * Tells if there is an error in the input.
   * @returns {boolean}
   */
  @api get hasError() {
    return !!this._errorMessage.length;
  }

  /**
   * Handles the changes in the input.
   * @return {void}
   */
  handleChange = (e) => {
    this._errorMessage = '';
    this._value = e.target.value;
  };

  /**
   * Returns the value of the input.
   * @returns {string}
   */
  @api get value() {
    return this._value;
  }

  /**
   * Shows an error message in the component if there is an error.
   * @returns {void}
   */
  @api reportValidity() {
    if (this.required && !this._value) {
      this._errorMessage = this.messageWhenValueMissing;
    }
  }
}
