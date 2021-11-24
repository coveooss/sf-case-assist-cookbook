import { LightningElement, api } from 'lwc';
import writeDescriptiveTitle from '@salesforce/label/c.cookbook_SubjectInputLabel';
import errorValueMissing from '@salesforce/label/c.cookbook_ValueMissing';
import valueTooShort from '@salesforce/label/c.cookbook_ValueTooShort';
import valueTooLong from '@salesforce/label/c.cookbook_ValueTooLong';

/**
 * The `SubjectInput` component  displays a text input for the case subject.
 * @example
 * <c-subject-input label="Write a descriptive title" maxLength="50" ></c-subject-input>
 */
export default class SubjectInput extends LightningElement {
  labels = {
    writeDescriptiveTitle,
    errorValueMissing,
    valueTooLong,
    valueTooShort
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
   * The minimum length of the string to be written in the input.
   * @api
   * @type {number}
   * @defaultValue `0`
   */
  @api minLength = 10;

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

  /**
   * The error message to show when the value is too short.
   * @api
   * @type {string}
   * @defaultValue `'Your entry is too short.'`
   */
  @api messageWhenTooShort = valueTooShort;

  /**
   * The error message to show when the value is too long.
   * @api
   * @type {string}
   * @defaultValue `'Your entry is too long.'`
   */
  @api messageWhenTooLong = valueTooLong;

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
   * Tells if thers is an error in the input.
   * @returns {boolean}
   */
  @api get hasError() {
    return this._hasError;
  }

  /**
   * @api
   * Shows error messages in the componets if there is some.
   * @returns {void}
   */
  @api reportValidity() {
    const input = this.template.querySelector('input');
    const { valid, valueMissing, tooShort, tooLong } = input.validity;
    if (!valid) {
      this._hasError = true;
      if (valueMissing) {
        this._errorMessage = this.messageWhenValueMissing;
      } else if (tooShort) {
        this._errorMessage = this.messageWhenTooShort;
      } else if (tooLong) {
        this._errorMessage = this.messageWhenTooLong;
      }
    }
  }
}
