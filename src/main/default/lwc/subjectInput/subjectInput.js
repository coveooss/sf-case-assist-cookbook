import { LightningElement, api } from 'lwc';
import writeDescriptiveTitle from '@salesforce/label/c.cookbook_SubjectInputLabel';

/**
 * The `SubjectInput` component  displays a text input for the case subject.
 * @example
 * <c-subject-input label="Write a descriptive title" maxLength="50" ></c-subject-input>
 */
export default class SubjectInput extends LightningElement {
  labels = {
    writeDescriptiveTitle
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

  /** @type {string} */
  _value = '';

  handleChange = (e) => {
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
}
