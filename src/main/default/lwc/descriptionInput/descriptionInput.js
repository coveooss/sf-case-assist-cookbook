import { LightningElement, api } from 'lwc';
import explainProblem from '@salesforce/label/c.cookbook_DescriptionInputLabel';

/**
 * The `descriptionInput` component displays a rich text input for the case description.
 * @example
 * <c-description-input label="Explain the problem"></c-description-input>
 */
export default class DescriptionInput extends LightningElement {
  labels = {
    explainProblem
  };

  /**
   * The label to be shown to the user.
   * @type {string}
   * @defaultValue `'Explain the problem'`
   */
  @api label = this.labels.explainProblem;

  /** @type {string} */
  _value = '';

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

  handleChange(e) {
    this._value = e.target.value;
  }

  /**
   * Returns the value of the input.
   * @returns {string}
   */
  @api get value() {
    return this._value;
  }
}
