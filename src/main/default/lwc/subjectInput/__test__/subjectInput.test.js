import { createElement } from 'lwc';
import SubjectInput from 'c/subjectInput';

function createTestComponent() {
  const element = createElement('c-subject-input', {
    is: SubjectInput
  });
  document.body.appendChild(element);

  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

jest.mock(
  '@salesforce/label/c.cookbook_SubjectInputTitle',
  () => ({ default: 'Write a descriptive title' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_ValueMissing',
  () => ({ default: 'Complete this field.' }),
  {
    virtual: true
  }
);

describe('c-subject-input', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the input label', async () => {
    const element = createTestComponent();
    const expectedLabel = 'Expected Label';
    element.label = expectedLabel;

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('c-section-title');
    expect(labelNode).not.toBeNull();
    expect(labelNode.title).toBe(expectedLabel);
  });

  it('should display the correct localized label', async () => {
    const element = createTestComponent();
    const expectedLabel = 'Write a descriptive title';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('c-section-title');
    expect(labelNode).not.toBeNull();
    expect(labelNode.title).toBe(expectedLabel);
  });
  
  it('should display the input', async () => {
    const element = createTestComponent();

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector('input');
    expect(inputNode).not.toBeNull();
  });
  it('should display the correct value in the input', async () => {
    const element = createTestComponent();
    const expectedValue = 'Expected Value';

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector('input');

    const inputEvent = new CustomEvent('input');
    inputNode.value = expectedValue;
    inputNode.dispatchEvent(inputEvent);

    expect(element.value).toBe(expectedValue);
  });
  it('should respect the max length of the input', async () => {
    const element = createTestComponent();
    const maxLength = 26;
    const longValue = 'The value should end here. and not here.';
    const expectedValue = longValue.substring(0, maxLength);
    element.maxLength = maxLength;

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector('input');

    const inputEvent = new CustomEvent('input');
    inputNode.value = longValue;
    await inputNode.dispatchEvent(inputEvent);

    expect(element.value).toBe(expectedValue);
  });
  it('should show an error when the value is empty and the input is required', async () => {
    const element = createTestComponent();
    const expectedErrorMessage = 'Expected Error Message';
    element.required = true;
    element.messageWhenValueMissing = expectedErrorMessage;

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector('input');
    inputNode.value = '';
    await element.reportValidity();
    const errorNode = element.shadowRoot.querySelector(
      'div.slds-form-element__help'
    );

    expect(element.hasError).toBe(true);
    expect(errorNode).not.toBeNull();
    expect(errorNode.textContent).toBe(expectedErrorMessage);
  });
  it('should show the default localized error message when the value is empty and the input is required', async () => {
    const element = createTestComponent();
    const expectedErrorMessage = 'Complete this field.';
    element.required = true;

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector('input');
    inputNode.value = '';
    await element.reportValidity();
    const errorNode = element.shadowRoot.querySelector(
      'div.slds-form-element__help'
    );

    expect(element.hasError).toBe(true);
    expect(errorNode).not.toBeNull();
    expect(errorNode.textContent).toBe(expectedErrorMessage);
  });
});
