import { createElement } from 'lwc';
import CaseReviewForm from 'c/caseReviewForm';
import {
  FlowAttributeChangeEventName,
  FlowNavigationNextEventName
} from 'lightning/flowSupport';

import { analyticsActionNames } from 'c/analyticsActionNames';
import { coveoua } from 'c/analyticsBeacon';

jest.mock('c/analyticsBeacon');

const EXPECTED_SEND_EVENT_PARAMS = ['send', 'event', 'svc', 'click'];

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

function createComponent(beforeAddFn = () => {}) {
  const element = createElement('c-case-review-form', {
    is: CaseReviewForm
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

describe('c-case-review-form', () => {
  beforeEach(() => {
    coveoua.mockClear();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render the record edit form', async () => {
    const element = createComponent();

    element.caseData = '{}';

    await flushPromises();
    const recordEditForm = element.shadowRoot.querySelector(
      'lightning-record-edit-form'
    );
    expect(recordEditForm).not.toBeNull();
  });

  it('should set the correct heading', async () => {
    const element = createComponent();

    const expectedHeading = 'foo';

    element.caseData = '{}';
    element.heading = expectedHeading;

    await flushPromises();
    const headingElement = element.shadowRoot.querySelector(
      'h1.slds-text-heading_large'
    );
    expect(headingElement.textContent).toBe(expectedHeading);
  });

  it('should set the correct subHeading', async () => {
    const element = createComponent();

    element.caseData = '{}';
    const expectedSubText = 'foo';

    element.subHeading = expectedSubText;

    await flushPromises();
    const subTextElement = element.shadowRoot.querySelector(
      'h2.slds-text-heading_large'
    );
    expect(subTextElement.textContent).toBe(expectedSubText);
  });

  describe('when a case field has been modified', () => {
    it('should set the ticket data on coveoua and then send the TICKET_FIELD_UPDATE event', async () => {
      const testSubject = 'This is a test subject';
      const element = createComponent();

      setSubject(element, testSubject);

      await flushPromises();
      expect(coveoua).toHaveBeenCalledTimes(3);
      // Expect the updated ticket data in coveoua
      const expectedTicketDataCallParams = [
        'svc:setTicket',
        {
          subject: testSubject,
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

  describe('when the cancel button is clicked', () => {
    it('should send the TICKET_CANCEL action with coveoua', () => {
      const element = createComponent();
      const cancelButton = element.shadowRoot.querySelector(
        'lightning-button[data-role="cancel"]'
      );
      if (cancelButton === null) {
        throw new Error('Cannot find a cancel button to test');
      }
      const clickEvent = new CustomEvent('click');
      cancelButton.dispatchEvent(clickEvent);

      expect(coveoua).toHaveBeenCalledTimes(2);
      const expectedTicketCancelParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_CANCEL,
        {
          reason: 'Quit'
        }
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedTicketCancelParams);
      expect(coveoua.mock.calls[1]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });

  describe('when the button submit is clicked', () => {
    it('should send the FlowAttributeChangeEvent on the record-edit-form success event', () => {
      const successEvent = new CustomEvent('success', {
        detail: {
          id: 12345
        }
      });
      const flowAttributeChangeHandler = jest.fn();
      const element = createComponent();

      element.addEventListener(
        FlowAttributeChangeEventName,
        flowAttributeChangeHandler
      );

      element.caseData = '{}';

      const recordEditForm = element.shadowRoot.querySelector(
        'lightning-record-edit-form'
      );
      if (recordEditForm === null) {
        throw new Error('Cannot find a record edit form');
      }
      recordEditForm.dispatchEvent(successEvent);
      expect(flowAttributeChangeHandler).toHaveBeenCalledTimes(1);
    });

    it('should send the FlowNavigationNextEvent if the next action is there', () => {
      const successEvent = new CustomEvent('success', {
        detail: {
          id: 12345
        }
      });
      const flowNavigationHandler = jest.fn();
      const element = createComponent();

      element.caseData = '{}';
      element.availableActions = ['NEXT'];

      const recordEditForm = element.shadowRoot.querySelector(
        'lightning-record-edit-form'
      );
      if (recordEditForm === null) {
        throw new Error('Cannot find a record edit form');
      }
      element.addEventListener(
        FlowNavigationNextEventName,
        flowNavigationHandler
      );
      recordEditForm.dispatchEvent(successEvent);
      expect(flowNavigationHandler).toHaveBeenCalledTimes(1);
    });

    it('should not send the FlowNavigationNextEvent if the next action is not there', () => {
      const successEvent = new CustomEvent('success', {
        detail: {
          id: 12345
        }
      });
      const flowNavigationHandler = jest.fn();
      const element = createComponent();

      element.caseData = '{}';

      const recordEditForm = element.shadowRoot.querySelector(
        'lightning-record-edit-form'
      );
      if (recordEditForm === null) {
        throw new Error('Cannot find a record edit form');
      }
      element.addEventListener(
        FlowNavigationNextEventName,
        flowNavigationHandler
      );
      recordEditForm.dispatchEvent(successEvent);
      expect(flowNavigationHandler).not.toHaveBeenCalled();
    });

    it('should send a TICKET_CREATE event with coveoua', () => {
      const expectedSubject = 'test subject';
      const expectedDescription = 'test description longer';
      const expectedId = 12345;

      const successEvent = new CustomEvent('success', {
        detail: {
          id: expectedId
        }
      });
      const element = createComponent((elem) => {
        elem.caseData = JSON.stringify({
          Subject: expectedSubject,
          Description: expectedDescription
        });
      });

      const recordEditForm = element.shadowRoot.querySelector(
        'lightning-record-edit-form'
      );
      if (recordEditForm === null) {
        throw new Error('Cannot find a record edit form');
      }
      recordEditForm.dispatchEvent(successEvent);

      expect(coveoua).toHaveBeenCalledTimes(3);
      // Expect the setTicket to have been called with the right values
      const expectedSetTicketEventParams = [
        'svc:setTicket',
        {
          subject: expectedSubject,
          description: expectedDescription,
          id: expectedId,
          custom: {
            reason: undefined
          }
        }
      ];
      expect(coveoua.mock.calls[0]).toEqual(expectedSetTicketEventParams);
      // Expect the setAction to have been called with ticket_create
      const expectedSetActionParams = [
        'svc:setAction',
        analyticsActionNames.TICKET_CREATE
      ];
      expect(coveoua.mock.calls[1]).toEqual(expectedSetActionParams);
      // Expect the send event to have been called
      expect(coveoua.mock.calls[2]).toEqual(EXPECTED_SEND_EVENT_PARAMS);
    });
  });
});
