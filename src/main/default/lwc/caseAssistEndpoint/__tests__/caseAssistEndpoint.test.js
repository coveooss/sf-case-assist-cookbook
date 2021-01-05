import CaseAssistEndpoint from 'c/caseAssistEndpoint';
import getCaseClassifications from '@salesforce/apex/CaseAssistEndpoint.getCaseClassifications';
import getDocumentSuggestions from '@salesforce/apex/CaseAssistEndpoint.getDocumentSuggestions';

const MOCK_CASE_CLASSIFICATIONS = {
  field1: {
    predictions: [
      {
        confidence: 1,
        value: 'foo'
      }
    ]
  }
};

const MOCK_DOCUMENT_SUGGESTIONS = [
  {
    hasHtmlVersion: true,
    uniqueId: 'foo',
    fields: {
      aField: 'bar'
    }
  }
];

const ERROR_RESPONSE = {
  body: { message: 'An internal server error has occurred' },
  ok: false,
  status: 500,
  statusText: 'Internal Server Error'
};

// Mocking imperative Apex method call
jest.mock(
  '@salesforce/apex/CaseAssistEndpoint.getCaseClassifications',
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

// Mocking imperative Apex method call
jest.mock(
  '@salesforce/apex/CaseAssistEndpoint.getDocumentSuggestions',
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

describe('c-case-assist-endpoint', () => {
  afterEach(() => {
    // Clear mocks so that every test run has a clean implementation.
    jest.clearAllMocks();

    // The jsdom instance is shared across test cases in a single file so reset the DOM.
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    return Promise.resolve();
  });

  describe('fetchCaseClassifications', () => {
    it('should throw an error if fetchCaseClassifications returns an error response', async () => {
      getCaseClassifications.mockRejectedValue(ERROR_RESPONSE);

      const endpoint = new CaseAssistEndpoint();

      await expect(() =>
        endpoint.fetchCaseClassifications('foo', 'bar', 'baz')
      ).rejects.toThrow();
    });

    it('should throw an error if fetchCaseClassifications fails to return', async () => {
      getCaseClassifications.mockRejectedValue(null);

      const endpoint = new CaseAssistEndpoint();

      await expect(() =>
        endpoint.fetchCaseClassifications('foo', 'bar', 'baz')
      ).rejects.toThrow();
    });

    it('should parse and return correctly case classifications data', async () => {
      getCaseClassifications.mockResolvedValue(
        JSON.stringify(MOCK_CASE_CLASSIFICATIONS)
      );

      const endpoint = new CaseAssistEndpoint();

      const caseClassificationData = await endpoint.fetchCaseClassifications(
        'foo',
        'bar',
        'baz'
      );
      expect(caseClassificationData).toStrictEqual(MOCK_CASE_CLASSIFICATIONS);
    });
  });

  describe('fetchDocSuggestions', () => {
    it('should throw an error if fetchDocSuggestions returns an error response', async () => {
      getDocumentSuggestions.mockRejectedValue(ERROR_RESPONSE);

      const endpoint = new CaseAssistEndpoint();

      await expect(() =>
        endpoint.fetchDocSuggestions('foo', 'bar', 'baz')
      ).rejects.toThrow();
    });

    it('should throw an error if fetchDocSuggestions fails to return data', async () => {
      getDocumentSuggestions.mockRejectedValue(null);

      const endpoint = new CaseAssistEndpoint();

      await expect(() =>
        endpoint.fetchDocSuggestions('foo', 'bar', 'baz')
      ).rejects.toThrow();
    });

    it('should parse and return correctly document suggestions data', async () => {
      getDocumentSuggestions.mockResolvedValue(
        JSON.stringify(MOCK_DOCUMENT_SUGGESTIONS)
      );

      const endpoint = new CaseAssistEndpoint();

      const documentSuggestionsData = await endpoint.fetchDocSuggestions(
        'foo',
        'bar',
        'baz'
      );
      expect(documentSuggestionsData).toStrictEqual(MOCK_DOCUMENT_SUGGESTIONS);
    });
  });
});
