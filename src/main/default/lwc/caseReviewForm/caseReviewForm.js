import { LightningElement, api } from 'lwc';
import {
  FlowAttributeChangeEvent,
  FlowNavigationNextEvent
} from 'lightning/flowSupport';

import { analyticsActionNames } from 'c/analyticsActionNames';
import { coveoua } from 'c/analyticsBeacon';
import { debounce } from 'c/utils';

export default class CaseReviewForm extends LightningElement {
  /**
   * A stringified object representing the current fields set on the case.
   */
  @api caseData;

  /**
   * The title of the main section.
   */
  @api heading = 'Please review your case before submission';

  /**
   * The title of the sub-section which contains additional fields.
   */
  @api subHeading = 'Select related categories';

  /**
   * This is the delay before sending a query and analytics events on user typing.
   */
  @api caseEditDelayMs = 500;

  /**
   * An output variable to use in Salesforce flows will be the newly created case Id.
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api recordId;

  /**
   * Available flow actions to that screen.
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];

  constructor() {
    super();
    this._caseData = {};
  }

  connectedCallback() {
    // Debounce function to not send an event every letter typed.
    this.debounceTicketUpdate = debounce(
      this.sendTicketFieldUpdated,
      this.caseEditDelayMs
    );
    // We want this to potentially throw on purpose. If this fails it means we did not get the case data from the
    // previous screens which would leave this screen as a blank case creation form and force the user to re-submit all
    // his case information. You can choose to handle it differently.
    try {
      this._caseData = JSON.parse(this.caseData);
    } catch (err) {
      this._caseData = {};
    }
  }

  handleFormInputChange(event) {
    this._caseData[event.target.fieldName] = event.detail.value;
    this.debounceTicketUpdate(event.target.fieldName);
  }

  handleButtonCancel() {
    this.sendCaseCancelledEvent();
  }

  handleSuccess(event) {
    this.recordId = event.detail.id;

    this.sendCaseCreatedEvent(this.recordId);

    const attributeChangeEvent = new FlowAttributeChangeEvent(
      'recordId',
      this.recordId
    );
    this.dispatchEvent(attributeChangeEvent);

    this.goNext();
  }

  goNext() {
    if (this.availableActions.some((action) => action === 'NEXT')) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }

  sendTicketFieldUpdated(fieldName) {
    coveoua('svc:setTicket', {
      subject: this._caseData.Subject,
      description: this._caseData.Description,
      custom: {
        reason: this._caseData.Reason
      }
    });
    coveoua('svc:setAction', analyticsActionNames.TICKET_FIELD_UPDATE, {
      fieldName
    });
    coveoua('send', 'event', 'svc', 'click');
  }

  sendCaseCancelledEvent() {
    coveoua('svc:setAction', analyticsActionNames.TICKET_CANCEL, {
      reason: 'Quit'
    });
    coveoua('send', 'event', 'svc', 'click');
  }

  sendCaseCreatedEvent(recordId) {
    coveoua('svc:setTicket', {
      subject: this._caseData.Subject,
      description: this._caseData.Description,
      id: recordId,
      custom: {
        reason: this._caseData.Reason
      }
    });
    coveoua('svc:setAction', analyticsActionNames.TICKET_CREATE);
    coveoua('send', 'event', 'svc', 'click');
  }
}
