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
  '@salesforce/label/c.cookbook_SubjectInputLabel',
  () => ({ default: 'Write a descriptive title' }),
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
  it('should respect the max lenght of the input', async () => {
    const element = createTestComponent();
    const longValue = 'The value should end here. and not here.';
    const expectedValue = 'The value should end here.';
    const maxLength = 26;
    element.maxLength = maxLength;

    await flushPromises();
    const inputNode = element.shadowRoot.querySelector('input');

    const inputEvent = new CustomEvent('input');
    inputNode.value = longValue;
    await inputNode.dispatchEvent(inputEvent);

    expect(element.value).toBe(expectedValue);
  });
});
