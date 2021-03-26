import { createElement } from 'lwc';
import {
  FlowAttributeChangeEventName,
  FlowNavigationNextEventName
} from 'lightning/flowSupport';
import CaseAssistFlow from 'c/caseAssistFlow';
import CaseAssistEndpoint from 'c/caseAssistEndpoint';
import { analyticsActionNames } from 'c/analyticsActionNames';
import { coveoua } from 'c/analyticsBeacon';

jest.mock('c/analyticsBeacon');
jest.mock('c/caseAssistEndpoint');
jest.useFakeTimers();

const EXPECTED_SEND_EVENT_PARAMS = ['send', 'event', 'svc', 'click'];
const TEST_CASE = {
  subject: 'This is a test subject',
  description: 'This is a test description long enough',
  reason: 'foo'
};

function createComponent(beforeAddFn = () => {}) {
  const element = createElement('c-case-assist-flow', {
    is: CaseAssistFlow
  });
  beforeAddFn(element);
  document.body.appendChild(element);

  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

function setSubject(element, subjectValue) {
  const subjectInput = element.shadowRoot.querySelector(
    'lightning-input-field[data-field-name="Subject"]'
  );
  subjectInput.value = subjectValue;
  subjectInput.dispatchEvent(
    new CustomEvent('change', {
      detail: {
        value: subjectInput.value
      }
    })
  );
}

function setDescription(element, descriptionValue) {
  const descriptionInput = element.shadowRoot.querySelector(
    'lightning-input-field[data-field-name="Description"]'
  );

  descriptionInput.value = descriptionValue;
  descriptionInput.dispatchEvent(
    new CustomEvent('change', {
      detail: {
        value: descriptionInput.value
      }
    })
  );
}

function setSubjectAndDescriptionValues(
  element,
  subjectValue,
  descriptionValue
) {
  if (subjectValue) {
    setSubject(element, subjectValue);
  }
  if (descriptionValue) {
    setDescription(element, descriptionValue);
  }
}

describe('c-case-assist-flow', () => {
  beforeEach(() => {
    CaseAssistEndpoint.mockClear();
    coveoua.mockClear();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('when the component renders', () => {
    it('should render the form with the subject and description inputs', () => {
      const element = createComponent();

      const recordEditForm = element.shadowRoot.querySelector(
        'lightning-record-edit-form'
      );
      expect(recordEditForm).not.toBeNull();

      const subjectInput = element.shadowRoot.querySelector(
        'lightning-input-field[data-field-name="Subject"]'
      );
      expect(subjectInput).not.toBeNull();
      expect(subjectInput.fieldName).toBe('Subject');

      const descriptionInput = element.shadowRoot.querySelector(
        'lightning-input-field[data-field-name="Description"]'
      );
      expect(descriptionInput).not.toBeNull();
      expect(descriptionInput.fieldName).toBe('Description');
    });

    it('should render the correct heading text heading', async () => {
      const element = createComponent();

      const headingNode = element.shadowRoot.querySelector('h1.h1_heading');

      await flushPromises();
      expect(headingNode).not.toBeNull();
      expect(headingNode.textContent).not.toBeNull();
    });

    it('should send a TICKET_CREATE_START event with coveoua', () => {
      createComponent();
      expect(coveoua).toHaveBeenCalledTimes(2);
      // Expect coveoua to have been called like so coveoua('svc:setAction', analyticsActionNames.TICKET_CREATE_START)
      const expectedFirstCall = [
        'svc:setAction',
        analyticsActionNames.TICKET_CREATE_START
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedFirstCall);
      expect(coveoua.mock.calls[1]).toEqual([
        'send',
        'event',
        'svc',
        'flowStart'
      ]);
    });
  });

  describe('when the subject and description are filled', () => {
    it('should render the fields section', async () => {
      const element = createComponent();

      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Flush microtasks
      await flushPromises();
      const subHeadingNode = element.shadowRoot.querySelector(
        'h1.h1_sub-heading'
      );
      expect(subHeadingNode).not.toBeNull();
      const fieldSectionContainer = element.shadowRoot.querySelector(
        'div.div_field-section'
      );
      expect(fieldSectionContainer).not.toBeNull();
      // Expect at least 1 suggestion row for a field
      const suggestionsFieldNode = fieldSectionContainer.querySelector(
        'c-case-assist-suggestions'
      );
      expect(suggestionsFieldNode).not.toBeNull();
    });

    it('should not call the CaseAssistEndpoint before the debounce timer', () => {
      const element = createComponent();
      expect(CaseAssistEndpoint).toHaveBeenCalledTimes(1);

      const mockCaseAssistEndpointInstance =
        CaseAssistEndpoint.mock.instances[0];

      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Should not have called the endpoint before the debounce timer.
      expect(
        mockCaseAssistEndpointInstance.fetchCaseClassifications
      ).not.toHaveBeenCalled();
    });

    it('should call the CaseAssistEndpoint with the correct caseData after the debounce timer', () => {
      const element = createComponent();
      expect(CaseAssistEndpoint).toHaveBeenCalledTimes(1);

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      const mockCaseAssistEndpointInstance =
        CaseAssistEndpoint.mock.instances[0];

      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      expect(
        mockCaseAssistEndpointInstance.fetchCaseClassifications
      ).not.toHaveBeenCalled();

      // Fast-forward until all timers have been executed
      jest.runAllTimers();

      expect(
        mockCaseAssistEndpointInstance.fetchCaseClassifications
      ).toHaveBeenCalledTimes(1);
      expect(
        mockCaseAssistEndpointInstance.fetchCaseClassifications.mock.calls[0][0]
      ).toBe(TEST_CASE.subject);
      expect(
        mockCaseAssistEndpointInstance.fetchCaseClassifications.mock.calls[0][1]
      ).toBe(TEST_CASE.description);
    });

    it('should get the visitorId value from localStorage', () => {
      const element = createComponent();
      expect(CaseAssistEndpoint).toHaveBeenCalledTimes(1);

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      const mockCaseAssistEndpointInstance =
        CaseAssistEndpoint.mock.instances[0];

      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Fast-forward until all timers have been executed
      jest.runAllTimers();
      expect(
        mockCaseAssistEndpointInstance.fetchCaseClassifications.mock.calls[0][2]
      ).toBe(testVisitorId);
    });

    it('should emit the FlowAttributeChangeEvent', () => {
      const element = createComponent();
      const handler = jest.fn();
      element.addEventListener(FlowAttributeChangeEventName, handler);

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      const expectedCaseData = {
        Subject: TEST_CASE.subject,
        Description: TEST_CASE.description
      };
      // Update the Subject and Description and emit the change events
      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      const expectedAttributeName = 'caseData';

      // Should have dispatched the FlowAttributeChangeEvent once per changed field.
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.calls[0][0].detail.attributeName).toBe(
        expectedAttributeName
      );
      expect(handler.mock.calls[1][0].detail.attributeName).toBe(
        expectedAttributeName
      );
      expect(handler.mock.calls[1][0].detail.attributeValue).toBe(
        JSON.stringify(expectedCaseData)
      );
    });

    it('should set the ticket data on coveoua and then send the TICKET_FIELD_UPDATE event', async () => {
      const element = createComponent();

      // Clear the mock after the initial creation
      coveoua.mockClear();

      const testVisitorId = 'test-visitor-id';
      localStorage.setItem('visitorId', testVisitorId);

      setSubject(element, TEST_CASE.subject);
      // Flush microtasks
      await flushPromises();

      expect(coveoua).toHaveBeenCalledTimes(3);
      // Expect the updated ticket data in coveoua
      const expectedTicketDataCallParams = [
        'svc:setTicket',
        {
          subject: TEST_CASE.subject,
          custom: {
            reason: undefined
          }
        }
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedTicketDataCallParams);

      // Expect the TICKET_FIELD_UPDATE event to have been sent.
      const expectedFieldUpdatedPayload = {
        fieldName: 'Subject'
      };
      const expectedFieldUpdatedParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_FIELD_UPDATE,
        expectedFieldUpdatedPayload
      ];
      expect(coveoua.mock.calls[1]).toEqual(expectedFieldUpdatedParams);
      expect(coveoua.mock.calls[2]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });

  describe('when a picklist value is selected', () => {
    it('should emit the FlowAttributeChangeEvent with the right values', async () => {
      const element = createComponent();
      const flowAttributeChangeEventHandler = jest.fn();

      const expectedAttributeName = 'caseData';
      const expectedFlowAttributeChangeBody = JSON.stringify({
        Subject: TEST_CASE.subject,
        Description: TEST_CASE.description,
        Reason: TEST_CASE.reason
      });

      // Update the Subject and Description and emit the change events
      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Flush microtasks
      await flushPromises();

      const reasonPicklist = element.shadowRoot.querySelector(
        'lightning-input-field[data-field-name="Reason"]'
      );
      if (reasonPicklist === null) {
        throw new Error('Cannot find a reason picklist to test on');
      }

      reasonPicklist.value = TEST_CASE.reason;
      element.addEventListener(
        FlowAttributeChangeEventName,
        flowAttributeChangeEventHandler
      );
      const changeEvent = new CustomEvent('change');
      reasonPicklist.dispatchEvent(changeEvent);

      // Expect the FlowAttributeChangeEvent to have been called with the right parameters
      expect(flowAttributeChangeEventHandler).toHaveBeenCalledTimes(1);
      expect(
        flowAttributeChangeEventHandler.mock.calls[0][0].detail.attributeName
      ).toBe(expectedAttributeName);
      expect(
        flowAttributeChangeEventHandler.mock.calls[0][0].detail.attributeValue
      ).toBe(expectedFlowAttributeChangeBody);
    });

    it('should set the ticket data on coveoua and then send the TICKET_FIELD_UPDATE event', async () => {
      const element = createComponent();

      // Update the Subject and Description and emit the change events
      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Flush microtasks
      await flushPromises();

      coveoua.mockClear();

      const reasonPicklist = element.shadowRoot.querySelector(
        'lightning-input-field[data-field-name="Reason"]'
      );
      if (reasonPicklist === null) {
        throw new Error('Cannot find a reason picklist to test on');
      }

      reasonPicklist.value = TEST_CASE.reason;
      const changeEvent = new CustomEvent('change');
      reasonPicklist.dispatchEvent(changeEvent);

      // Expect coveoua to have been called with the right parameters
      expect(coveoua).toHaveBeenCalledTimes(3);
      const expectedSetTicketParams = [
        'svc:setTicket',
        {
          subject: TEST_CASE.subject,
          description: TEST_CASE.description,
          custom: {
            reason: TEST_CASE.reason
          }
        }
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedSetTicketParams);
      const expectedFieldUpdatePayload = {
        fieldName: 'Reason'
      };
      const expectedFieldUpdatedParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_FIELD_UPDATE,
        expectedFieldUpdatePayload
      ];
      expect(coveoua.mock.calls[1]).toEqual(expectedFieldUpdatedParams);
      expect(coveoua.mock.calls[2]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });

  describe('when a suggestion is selected', () => {
    const MOCK_DATA = {
      FIELD_NAME: 'Reason',
      CONFIDENCE: 0.123,
      CLASSIFICATION_ID: 'b84ed8ed-a7b1-502f-83f6-90132e68adef',
      RESPONSE_ID: '24a729a0-5a0d-45e5-b6c8-5425627d90a5'
    };

    const fillCaseFormFields = async (element) => {
      // Update the Subject and Description and emit the change events
      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Fast-forward until all timers have been executed.
      // Ensures debounce fires and classifications are fetched from the API.
      jest.runAllTimers();

      // Flush microtasks
      await flushPromises();
      const fieldSectionContainer = element.shadowRoot.querySelector(
        'div.div_field-section'
      );

      if (fieldSectionContainer === null) {
        throw new Error('Cannot find a field section to test');
      }
      return fieldSectionContainer;
    };

    const clickOnCaseClassification = (element) => {
      // Expect at least 1 suggestion row for a field
      const suggestionsFieldNode = element.querySelector(
        'c-case-assist-suggestions'
      );
      if (suggestionsFieldNode === null) {
        throw new Error('Cannot find case assist suggestions to test');
      }
      const selectedEvent = new CustomEvent('selected', {
        detail: {
          fieldName: MOCK_DATA.FIELD_NAME,
          value: TEST_CASE.reason,
          confidence: MOCK_DATA.CONFIDENCE,
          id: MOCK_DATA.CLASSIFICATION_ID
        }
      });
      suggestionsFieldNode.dispatchEvent(selectedEvent);
    };

    const setupMockCaseAssistEndpoint = () => {
      const mockEndpoint = CaseAssistEndpoint.mock.instances[0];
      mockEndpoint.fetchCaseClassifications.mockReturnValue({
        fields: {
          [MOCK_DATA.FIELD_NAME]: {
            predictions: [
              {
                value: TEST_CASE.reason,
                confidence: MOCK_DATA.CONFIDENCE,
                id: MOCK_DATA.CLASSIFICATION_ID
              }
            ]
          }
        },
        responseId: MOCK_DATA.RESPONSE_ID
      });
    };

    it('should emit the FlowAttributeChangeEvent', async () => {
      const expectedAttributeName = 'caseData';
      const handler = jest.fn();
      const element = createComponent();

      const fieldSectionContainer = await fillCaseFormFields(element);

      // Trigger the suggestion clicked event
      element.addEventListener(FlowAttributeChangeEventName, handler);

      clickOnCaseClassification(fieldSectionContainer);

      // Should've called the FlowAttributeChangeEventName once
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.attributeName).toBe(
        expectedAttributeName
      );
    });

    it('should send the TICKET_CLASSIFICATION_CLICK event with coveoua', async () => {
      const element = createComponent();

      setupMockCaseAssistEndpoint();

      const fieldSectionContainer = await fillCaseFormFields(element);

      // Clear the mock because the events before that are not the target of this test.
      coveoua.mockClear();

      clickOnCaseClassification(fieldSectionContainer);

      // expect coveoua to have been called first with svc:setTicket
      expect(coveoua).toHaveBeenCalledTimes(3);

      // expect coveoua to have been called with TICKET_CLASSIFICATION_CLICK next
      const expectedTicketClassificationClickPayload = {
        classificationId: MOCK_DATA.CLASSIFICATION_ID,
        responseId: MOCK_DATA.RESPONSE_ID,
        fieldName: MOCK_DATA.FIELD_NAME,
        classification: {
          confidence: MOCK_DATA.CONFIDENCE,
          value: TEST_CASE.reason
        }
      };
      const expectedTicketClassificationClickParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_CLASSIFICATION_CLICK,
        expectedTicketClassificationClickPayload
      ];
      expect(coveoua.mock.calls[1]).toEqual(
        expectedTicketClassificationClickParams
      );

      // expect to send the event with coveoua
      expect(coveoua.mock.calls[2]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });

    it('should NOT send the TICKET_FIELD_UPDATE event with coveoua', async () => {
      const element = createComponent();

      setupMockCaseAssistEndpoint();

      const fieldSectionContainer = await fillCaseFormFields(element);

      // Clear the mock because the events before that are not the target of this test.
      coveoua.mockClear();

      clickOnCaseClassification(fieldSectionContainer);

      // With the lightning component in use changing programmatically the value of the picklist
      // when a suggestion is clicked also dispatches a change event from the picklist.
      const reasonPicklist = element.shadowRoot.querySelector(
        'lightning-input-field[data-field-name="Reason"]'
      );
      if (reasonPicklist === null) {
        throw new Error('Cannot find a reason picklist to test on');
      }

      reasonPicklist.value = TEST_CASE.reason;
      const changeEvent = new CustomEvent('change');
      reasonPicklist.dispatchEvent(changeEvent);

      // This picklist change event should not be sending an additional coveoua call, so we should see
      // 3 and ONLY 3 calls to coveoua. If it is not correctly ignored we should see 6 calls.

      // expect coveoua to have been called 3 times
      expect(coveoua).toHaveBeenCalledTimes(3);

      expect(coveoua.mock.calls[1][1]).toEqual(
        analyticsActionNames.TICKET_CLASSIFICATION_CLICK
      );
    });
  });

  describe('when the next button is clicked', () => {
    it('should send the TICKET_NEXT_STAGE event with coveoua', async () => {
      const element = createComponent();
      element.availableActions = ['NEXT'];
      // Update the Subject and Description and emit the change events
      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Flush microtasks
      await flushPromises();
      // Clear the mock because the events before that are not the target of this test.
      coveoua.mockClear();

      const nextStageButton = element.shadowRoot.querySelector(
        'lightning-button[data-role="next"]'
      );
      if (nextStageButton === null) {
        throw new Error('Cannot find a next button to test');
      }
      const clickEvent = new CustomEvent('click');
      nextStageButton.dispatchEvent(clickEvent);

      // Expect the right calls to have been made to coveoua
      expect(coveoua).toHaveBeenCalledTimes(3);
      const expectedTicketCancelParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_NEXT_STAGE
      ];
      // The first call is to setTicket which is tested elsewhere.
      expect(coveoua.mock.calls[1]).toEqual(expectedTicketCancelParams);
      expect(coveoua.mock.calls[2]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });

    it('should send the FlowNavigationNextEvent if the next action is there', async () => {
      const element = createComponent();
      element.availableActions = ['NEXT'];
      // Update the Subject and Description and emit the change events
      setSubjectAndDescriptionValues(
        element,
        TEST_CASE.subject,
        TEST_CASE.description
      );

      // Flush microtasks
      await flushPromises();
      const flowNavigationHandler = jest.fn();

      // Click on the button
      const nextStageButton = element.shadowRoot.querySelector(
        'lightning-button[data-role="next"]'
      );
      if (nextStageButton === null) {
        throw new Error('Cannot find a next button to test');
      }
      element.addEventListener(
        FlowNavigationNextEventName,
        flowNavigationHandler
      );
      const clickEvent = new CustomEvent('click');
      nextStageButton.dispatchEvent(clickEvent);

      expect(flowNavigationHandler).toHaveBeenCalledTimes(1);
    });
  });
});
