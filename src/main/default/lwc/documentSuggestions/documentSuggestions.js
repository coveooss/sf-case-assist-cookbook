import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

import CaseAssistEndpoint from 'c/caseAssistEndpoint';
import { analyticsActionNames } from 'c/analyticsActionNames';
import { coveoua } from 'c/analyticsBeacon';

/**
 * This component is a wrapper around the caseAssistResultList component.
 * Its role is to fetch document suggestions results from the Apex controller and then pass them to the
 * caseAssistResultList to be displayed as results visible to the user.
 */
export default class DocumentSuggestions extends LightningElement {
  /**
   * Available actions to the flow screen.
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];

  /**
   * The title of the document suggestions page.
   */
  @api heading = 'These might help solve your issue';

  /**
   * Stringified version of the case fields.
   */
  @api caseData;

  @track suggestedDocuments = [];

  constructor() {
    super();
    this._caseData = {};
    this.endpoint = new CaseAssistEndpoint();
  }

  connectedCallback() {
    try {
      this._caseData = JSON.parse(this.caseData);
      this.fetchDocumentSuggestions();
    } catch (error) {
      this.showCaseDataErrorToast();
      console.error(error);
    }
  }

  async fetchDocumentSuggestions() {
    try {
      const docSuggestionsResponse = (await this.endpoint.fetchDocSuggestions(
        this._caseData.Subject,
        this._caseData.Description,
        this._caseData.visitorId || 'foo'
      )) || { responseId: '', documents: [] };

      this.lastResponseId = docSuggestionsResponse.responseId;
      if (
        Array.isArray(docSuggestionsResponse.documents) &&
        docSuggestionsResponse.documents.length > 0
      ) {
        this.suggestedDocuments = docSuggestionsResponse.documents;
      } else {
        this.showCaseDataErrorToast();
      }
    } catch (err) {
      this.lastResponseId = '';
      this.suggestedDocuments = [];
      this.showCaseDataErrorToast();
      console.error(err);
    }
  }

  handleResultClicked(event) {
    this.sendResultClickEvent(event.detail);
  }

  handleButtonSolved() {
    this.sendCaseSolvedEvent();
  }

  /**
   * This is an example of handling an error that could occur or when there are no results being returned.
   * It displays an error toast to the user of the flow indicating no results or an error in the data received.
   * You can have your own method to handle a potential error scenario.
   */
  showCaseDataErrorToast() {
    const evt = new ShowToastEvent({
      title: 'Could not find documents to help',
      message:
        'There was an error or no documents match the case information you have entered. Please continue.',
      variant: 'error',
      mode: 'dismissable'
    });
    this.dispatchEvent(evt);
  }

  handleButtonNext() {
    if (this.availableActions.some((action) => action === 'NEXT')) {
      this.sendTicketNextStage();
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }

  sendResultClickEvent(clickedData) {
    coveoua('svc:setAction', analyticsActionNames.SUGGESTION_CLICK, {
      suggestionId: clickedData.fields.permanentid,
      responseId: this.lastResponseId,
      suggestion: {
        documentUri: clickedData.clickUri,
        documentUriHash: clickedData.fields.urihash,
        documentTitle: clickedData.title,
        documentUrl: clickedData.fields.uri,
        documentPosition: clickedData.rank + 1 // documentPosition is 1 based.
      }
    });
    coveoua('send', 'event', 'svc', 'click');
  }

  sendCaseSolvedEvent() {
    coveoua('svc:setAction', analyticsActionNames.TICKET_CANCEL, {
      reason: 'Solved'
    });
    coveoua('send', 'event', 'svc', 'click');
  }

  sendTicketNextStage() {
    coveoua('svc:setAction', analyticsActionNames.TICKET_NEXT_STAGE);
    coveoua('send', 'event', 'svc', 'click');
  }
}
