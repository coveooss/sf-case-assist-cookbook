/* eslint-disable no-undef */
import { LightningElement, api } from 'lwc';
import explainProblem from '@salesforce/label/c.cookbook_DescriptionInputTitle';
import errorValueMissing from '@salesforce/label/c.cookbook_ValueMissing';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';
import { debounce } from 'c/utils';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */
/** @typedef {import("coveo").CaseInput} CaseInput */

/**
 * The `descriptionInput` component displays a rich text input for the case description.
 * @example
 * <c-description-input engine-id={engineId} case-edit-delay-ms="500" label="Explain the problem" message-when-value-missing="Complete this field." required display-strength-indicator></c-description-input>
 */
export default class DescriptionInput extends LightningElement {
  labels = {
    explainProblem,
    errorValueMissing
  };

  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
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
   * @defaultValue `'Complete this field.'`
   */
  @api messageWhenValueMissing = this.labels.errorValueMissing;
  /**
   * This is the delay before sending a query and analytics events on user typing, this value is in milliseconds.
   * @type {number}
   * @defaultValue `500`
   */
  @api caseEditDelayMs = 500;
  /**
   * Whether we display the description strength indicator or not.
   * @type {boolean}
   * @defaultValue `false`
   */
  @api displayStrengthIndicator = false;
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
   * The necessary number of words that the description must have in order to be considered strong.
   * @type {number}
   * @defaultValue `20`
   */
  @api strongDescriptionLength = 20;
  /** The initial value to be given to the input.
   * @type {string}
   */
  @api initialValue;
  /**
   * Wheather we want to prevent fetching classifications when the value of the input changes.
   * @type {boolean}
   */
  @api preventFetchClassificationsOnChange = false;
  /**
   * Wheather we want to prevent fetching suggestions when the value of the input changes.
   * @type {boolean}
   */
  @api preventFetchSuggestionsOnChange = false;

  /** @type {string} */
  _value = '';
  /** @type {string} */
  _fieldName = 'description';
  /** @type {boolean} */
  _validity = true;
  /** @type {CaseAssistEngine} */
  engine;
  /** @type {CaseInput} */
  input;
  /** @type {Function} */
  unsubscribeInput;

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
    this.debounceUpdateDescriptionState = debounce(
      this.updateDescriptionState,
      this.caseEditDelayMs
    );
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  /**
   * @param {CaseAssistEngine} engine
   */
  initialize = (engine) => {
    this.engine = engine;
    this.input = CoveoHeadlessCaseAssist.buildCaseInput(engine, {
      options: {
        field: this._fieldName
      }
    });

    if (this.initialValue) {
      this._value = this.initialValue;
      this.input.update(this.replaceTagsWithSpace(this._value));
    }
  };

  /**
   * Tells if there is an error in the input.
   * @returns {boolean}
   */
  @api get validity() {
    return this._validity;
  }

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
  @api validate() {
    this._validity = !this.required || !!this._value;
  }

  /**
   * Handles the changes in the input.
   * @returns {void}
   */
  handleChange = (e) => {
    this._validity = !this.required || !!e.target.value;
    this._value = e.target.value;
    this.debounceUpdateDescriptionState();
  };

  /**
   * Updates the engine state and dispatch the analytics actions.
   * @returns {void}
   */
  updateDescriptionState() {
    this.input.update(this.replaceTagsWithSpace(this._value), {
      caseClassifications: !this.preventFetchClassificationsOnChange,
      documentSuggestions: !this.preventFetchSuggestionsOnChange
    });
  }

  get currentProgress() {
    return this._value
      ? (this.getWordsCount(this._value) * 100) / this.strongDescriptionLength
      : 0;
  }

  /**
   * Returns the length of the rich text after transforming it to normal text.
   * @param {string} htmlStr
   * @returns {string}
   */
  getWordsCount(htmlStr) {
    return this.replaceTagsWithSpace(htmlStr).split(/\s+/).length;
  }

  /**
   * Returns rich text value after replacing the HTML tags with spaces.
   * @param {string} htmlStr
   * @returns {string}
   */
  replaceTagsWithSpace(htmlStr) {
    return htmlStr.replace(/(<[^>]*>)/gi, ' ').trim();
  }
}
