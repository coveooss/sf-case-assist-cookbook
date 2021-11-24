import { LightningElement, api } from 'lwc';
import writeDescriptiveTitle from '@salesforce/label/c.cookbook_SubjectInput';
import errorValueMissing from '@salesforce/label/c.cookbook_ValueMissing';

/**
 * The `SubjectInput` component  displays a text input for the case subject.
 * @example
 * <c-subject-input label="Write a descriptive title" maxLength="50" message-when-value-missing="Complete this field."></c-subject-input>
 */
export default class SubjectInput extends LightningElement {
  labels = {
    writeDescriptiveTitle,
    errorValueMissing
  };
  /**
   * The label of the input.
   * @api
   * @type {string}
   * @defaultValue `'Write a descriptive title'`
   */
  @api label = this.labels.writeDescriptiveTitle;

  /**
   * The maximum length of the string to be written in the input.
   * @api
   * @type {number}
   * @defaultValue `100`
   */
  @api maxLength = 100;

  /**
   * Tells if the input is required.
   * @api
   * @type {boolean}
   * @defaultValue `false`
   */
  @api required = false;

  /**
   * The error message to show when the value is missing.
   * @api
   * @type {string}
   * @defaultValue `'Complete this field.`
   */
  @api messageWhenValueMissing = errorValueMissing;

  /** @type {string} */
  _value = '';

  /** @type {string} */
  _errorMessage = '';

  /** @type {boolean} */
  _hasError = false;

  /**
   * Handles the changes in the input.
   * @return {void}
   */
  handleChange = (e) => {
    this._hasError = false;
    this._errorMessage = '';
    if (e.target.value.length <= this.maxLength) {
      this._value = e.target.value;
    } else {
      this._value = e.target.value.substring(0, this.maxLength);
    }
  };

  /**
   * Returns the value of the input.
   * @api
   * @returns {string}
   */
  @api get value() {
    return this._value;
  }

  /**
   * Returns the length of the value of the input.
   * @returns {number}
   */
  get length() {
    return this._value.length;
  }

  /**
   * Tells if the value of the input is valid.
   * @api
   * @type {boolean}
   */
  @api get valid() {
    const input = this.template.querySelector('input');
    return input.validity.valid;
  }

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
    return this._hasError
      ? 'slds-form-element slds-has-error'
      : 'slds-form-element';
  }

  /**
   * Tells if ther is an error in the input.
   * @returns {boolean}
   */
  @api get hasError() {
    return this._hasError;
  }

  /**
   * @api
   * Shows an error message in the componets if there an error.
   * @returns {void}
   */
  @api reportValidity() {
    const input = this.template.querySelector('input');
    if (input.validity.valueMissing) {
      this._hasError = true;
      this._errorMessage = this.messageWhenValueMissing;
    }
  }
}
