/* eslint-disable no-undef */
import { LightningElement, api } from 'lwc';
import writeDescriptiveTitle from '@salesforce/label/c.cookbook_SubjectInputTitle';
import errorValueMissing from '@salesforce/label/c.cookbook_ValueMissing';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';
import { debounce } from 'c/utils';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */
/** @typedef {import("coveo").CaseInput} CaseInput */

/**
 * The `SubjectInput` component  displays a text input for the case subject.
 * @example
 * <c-subject-input engineId={engineId} caseEditDelayMs="500" label="Write a descriptive title" maxLength="100" message-when-value-missing="Complete this field." required></c-subject-input>
 */
export default class SubjectInput extends LightningElement {
  labels = {
    writeDescriptiveTitle,
    errorValueMissing
  };

  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The label of the input.
   * @type {string}
   * @defaultValue `'Write a descriptive title'`
   */
  @api label = this.labels.writeDescriptiveTitle;
  /**
   * The maximum length of the string to be written in the input.
   * @type {number}
   * @defaultValue `100`
   */
  @api maxLength = 100;
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
  /**
   * This is the delay before sending a query and analytics events on user typing.
   */
  @api caseEditDelayMs = 500;

  /** @type {string} */
  _value = '';
  /** @type {string} */
  _fieldName = 'subject';
  /** @type {string} */
  _errorMessage = '';
  /** @type {CaseAssistEngine} */
  engine;
  /** @type {CaseInput} */
  input;
  /** @type {Function} */
  unsubscribeInput;

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
    this.debounceUpdateSubjectState = debounce(
      this.updateSubjectState,
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

    this.actions = {
      ...CoveoHeadlessCaseAssist.loadCaseAssistAnalyticsActions(engine),
      ...CoveoHeadlessCaseAssist.loadCaseInputActions(engine),
      ...CoveoHeadlessCaseAssist.loadCaseFieldActions(engine),
      ...CoveoHeadlessCaseAssist.loadDocumentSuggestionActions(engine)
    };
  };

  /**
   * Handles the changes in the input.
   * @return {void}
   */
  handleChange = (e) => {
    this._errorMessage = '';
    this._value = e.target.value.substring(0, this.maxLength);
    this.debounceUpdateSubjectState();
  };

  updateSubjectState() {
    this.engine.dispatch(
      this.actions.updateCaseInput({
        fieldName: this._fieldName,
        fieldValue: this._value
      })
    );
    this.engine.dispatch(this.actions.logUpdateCaseField(this._fieldName));
    this.engine.dispatch(this.actions.fetchCaseClassifications());
    this.engine.dispatch(this.actions.fetchDocumentSuggestions());
  }

  /**
   * Returns the value of the input.
   * @api
   * @returns {string}
   */
  @api get value() {
    return this._value;
  }
  set value(initialValue) {
    this._value = initialValue.substring(0, this.maxLength);
  }

  /**
   * Returns the length of the value of the input.
   * @returns {number}
   */
  get length() {
    return this._value.length;
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
   * Shows an error message in the componet if there is an error.
   * @returns {void}
   */
  @api reportValidity() {
    const input = this.template.querySelector('input');
    if (input.validity.valueMissing) {
      this._errorMessage = this.messageWhenValueMissing;
    }
  }
}
