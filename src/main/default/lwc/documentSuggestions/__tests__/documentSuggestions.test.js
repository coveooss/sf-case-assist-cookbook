import { createElement } from 'lwc';
import DocumentSuggestions from 'c/documentSuggestions';
import CaseAssistEndpoint from 'c/caseAssistEndpoint';
import { analyticsActionNames } from 'c/analyticsActionNames';
import { coveoua } from '../../analyticsBeacon/analyticsBeacon';

jest.mock('c/analyticsBeacon');
jest.mock('c/caseAssistEndpoint');

const EXPECTED_SEND_EVENT_PARAMS = ['send', 'event', 'svc', 'click'];

const MOCK_RESULT = {
  title: 'title',
  uniqueId: '12345',
  excerpt: 'excerpt',
  rank: 0,
  fields: {
    permanentid: 12345,
    urihash: 'foo',
    uri: 'foo.com'
  }
};

function createComponent(beforeAppend = () => {}) {
  const element = createElement('c-document-suggestions', {
    is: DocumentSuggestions
  });
  beforeAppend(element);
  document.body.appendChild(element);
  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

describe('c-document-suggestions', () => {
  beforeEach(() => {
    coveoua.mockClear();
    CaseAssistEndpoint.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('when the caseData is incorrect', () => {
    it('should still render the heading but display a console error message when it is null', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      const element = createComponent();

      const expectedHeading = 'Expected Heading';
      element.heading = expectedHeading;

      // Flush microtasks
      await flushPromises();
      // Expect console.error to have been called.
      expect(spy).toHaveBeenCalledTimes(1); // But the component should still display!
      const headingNode = element.shadowRoot.querySelector(
        'h1.slds-text-heading_large'
      );
      expect(headingNode.textContent).toBe(expectedHeading);
    });

    it('should still render the heading but display a console error message when it is not JSON', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      const element = createComponent((elem) => {
        elem.caseData = 'foo';
      });
      const expectedHeading = 'Expected Heading';
      element.heading = expectedHeading;

      // Flush microtasks
      await flushPromises();
      // Expect console.error to have been called.
      expect(spy).toHaveBeenCalledTimes(1);
      const headingNode = element.shadowRoot.querySelector(
        'h1.slds-text-heading_large'
      );
      expect(headingNode.textContent).toBe(expectedHeading);
    });
  });

  describe('when the caseData is correct', () => {
    it('should not error and should show the result list when the caseData is correct', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      const caseData = {
        Subject: 'foo',
        Description: 'bar'
      };

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      const element = createComponent((elem) => {
        elem.caseData = JSON.stringify(caseData);
      });

      // Flush microtasks
      await flushPromises();
      // Expect console.error to not have been called.
      expect(spy).not.toHaveBeenCalled();
      const documentResultListNode = element.shadowRoot.querySelector(
        'c-documents-result-list'
      );
      expect(documentResultListNode).not.toBeNull();
    });

    it('should call CaseAssistEndpoint to fetch document suggestions with the expected caseData', () => {
      expect(CaseAssistEndpoint).not.toHaveBeenCalled();

      const caseData = {
        Subject: 'foo',
        Description: 'bar'
      };

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      createComponent((elem) => {
        elem.caseData = JSON.stringify(caseData);
      });
      expect(CaseAssistEndpoint).toHaveBeenCalledTimes(1);

      const mockCaseAssistEndpointInstance =
        CaseAssistEndpoint.mock.instances[0];
      const mockFetchDocSuggestions =
        mockCaseAssistEndpointInstance.fetchDocSuggestions;
      expect(mockFetchDocSuggestions).toHaveBeenCalledTimes(1);
      expect(mockFetchDocSuggestions.mock.calls[0][0]).toBe(caseData.Subject);
      expect(mockFetchDocSuggestions.mock.calls[0][1]).toBe(
        caseData.Description
      );
    });

    it('should send the expected visitorId with a request to Document Suggestion', () => {
      expect(CaseAssistEndpoint).not.toHaveBeenCalled();

      const caseData = {
        Subject: 'foo',
        Description: 'bar'
      };

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      createComponent((elem) => {
        elem.caseData = JSON.stringify(caseData);
      });
      expect(CaseAssistEndpoint).toHaveBeenCalledTimes(1);

      const mockCaseAssistEndpointInstance =
        CaseAssistEndpoint.mock.instances[0];
      const mockFetchDocSuggestions =
        mockCaseAssistEndpointInstance.fetchDocSuggestions;

      expect(mockFetchDocSuggestions.mock.calls[0][2]).toBe(testVisitorId);
    });
  });

  describe('when a document suggestion is clicked', () => {
    it('should send a SUGGESTION_CLICK event with coveoua', async () => {
      const caseData = {
        Subject: 'foo',
        Description: 'bar'
      };

      const expectedResponseId = '24a729a0-5a0d-45e5-b6c8-5425627d90a5';

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      const element = createComponent((elem) => {
        elem.caseData = JSON.stringify(caseData);

        CaseAssistEndpoint.mock.instances[0].fetchDocSuggestions.mockReturnValue(
          {
            documents: [MOCK_RESULT],
            responseId: expectedResponseId
          }
        );
      });

      // Flush microtasks
      await flushPromises();

      const documentResultListNode = element.shadowRoot.querySelector(
        'c-documents-result-list'
      );
      if (documentResultListNode === null) {
        throw new Error('Cannot find a result list to send the click event');
      }
      const resultClickedEvent = new CustomEvent('resultclicked', {
        detail: MOCK_RESULT
      });
      documentResultListNode.dispatchEvent(resultClickedEvent);
      expect(coveoua).toHaveBeenCalledTimes(2);
      const expectedSuggestionClickedParams = [
        'svc:setAction',
        analyticsActionNames.SUGGESTION_CLICK,
        {
          suggestionId: MOCK_RESULT.fields.permanentid,
          responseId: expectedResponseId,
          suggestion: {
            documentUri: MOCK_RESULT.clickUri,
            documentUriHash: MOCK_RESULT.fields.urihash,
            documentTitle: MOCK_RESULT.title,
            documentUrl: MOCK_RESULT.fields.uri,
            documentPosition: MOCK_RESULT.rank + 1 // documentPosition is 1 based.
          }
        }
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedSuggestionClickedParams);
      expect(coveoua.mock.calls[1]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });

  describe('when the case solved button is clicked', () => {
    it('should send the TICKET_CANCEL event with coveoua', () => {
      const element = createComponent();
      const solvedButton = element.shadowRoot.querySelector(
        'lightning-button[data-role="solved"]'
      );
      if (solvedButton === null) {
        throw new Error('Cannot find a solved button to test');
      }
      const clickEvent = new CustomEvent('click');
      solvedButton.dispatchEvent(clickEvent);

      // Expect the right calls to have been made to coveoua
      expect(coveoua).toHaveBeenCalledTimes(2);
      const expectedTicketCancelParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_CANCEL,
        {
          reason: 'Solved'
        }
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedTicketCancelParams);
      expect(coveoua.mock.calls[1]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });

  describe('when the "I still have a problem" button is clicked', () => {
    it('should send the TICKET_NEXT_STAGE event with coveoua', () => {
      const element = createComponent();
      element.availableActions = ['NEXT'];
      const nextStageButton = element.shadowRoot.querySelector(
        'lightning-button[data-role="next"]'
      );
      if (nextStageButton === null) {
        throw new Error('Cannot find a next button to test');
      }
      const clickEvent = new CustomEvent('click');
      nextStageButton.dispatchEvent(clickEvent);

      // Expect the right calls to have been made to coveoua
      expect(coveoua).toHaveBeenCalledTimes(2);
      const expectedTicketCancelParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_NEXT_STAGE
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedTicketCancelParams);
      expect(coveoua.mock.calls[1]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });
});
