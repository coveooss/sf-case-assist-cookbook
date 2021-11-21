import { createElement } from 'lwc';
import DescriptionInput from 'c/descriptionInput';

function createTestComponent() {
  const element = createElement('c-description-input', {
    is: DescriptionInput
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
  '@salesforce/label/c.cookbook_DescriptionInputLabel',
  () => ({ default: 'Explain the problem' }),
  {
    virtual: true
  }
);

describe('c-description-input', () => {
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
    const expectedLabel = 'Explain the problem';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('c-section-title');
    expect(labelNode).not.toBeNull();
    expect(labelNode.title).toBe(expectedLabel);
  });
  it('should display the input', async () => {
    const element = createTestComponent();

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector(
      'lightning-input-rich-text'
    );
    expect(inputNode).not.toBeNull();
  });
  it('should display the correct value in the input', async () => {
    const element = createTestComponent();
    const expectedValue = 'Expected Value';

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector(
      'lightning-input-rich-text'
    );

    const inputEvent = new CustomEvent('change');
    inputNode.value = expectedValue;
    inputNode.dispatchEvent(inputEvent);

    expect(element.value).toBe(expectedValue);
  });
});
