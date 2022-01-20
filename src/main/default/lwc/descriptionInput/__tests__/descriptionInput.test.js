import { createElement } from 'lwc';
import DescriptionInput from 'c/descriptionInput';

function createTestComponent(props = {}) {
  const element = createElement('c-description-input', {
    is: DescriptionInput
  });
  document.body.appendChild(element);
  Object.keys(props).forEach((key) => {
    element[key] = props[key];
  });

  return element;
}

// Helper function to wait until the microtask queue is empty.
function allPromisesResolution() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

jest.mock(
  '@salesforce/label/c.cookbook_DescriptionInputTitle',
  () => ({ default: 'Explain the problem' }),
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

describe('c-description-input', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the input label', async () => {
    const expectedLabel = 'Expected Label';
    const element = createTestComponent({
      label: expectedLabel
    });

    await allPromisesResolution();
    const labelNode = element.shadowRoot.querySelector('c-section-title');
    expect(labelNode).not.toBeNull();
    expect(labelNode.title).toBe(expectedLabel);
  });

  it('should display the correct localized label', async () => {
    const element = createTestComponent();
    const expectedLabel = 'Explain the problem';

    await allPromisesResolution();
    const labelNode = element.shadowRoot.querySelector('c-section-title');
    expect(labelNode).not.toBeNull();
    expect(labelNode.title).toBe(expectedLabel);
  });

  it('should display the input', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const inputNode = element.shadowRoot.querySelector(
      'lightning-input-rich-text'
    );
    expect(inputNode).not.toBeNull();
  });

  it('should not display the description strength indicator by default', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const strengthIndicatorNode = element.shadowRoot.querySelector(
      'c-description-strength-indicator'
    );
    expect(strengthIndicatorNode).toBeNull();
  });

  it('should display the description strength indicator when #displayStrengthIndicator attribute is specified', async () => {
    const element = createTestComponent();
    element.displayStrengthIndicator = true;

    await allPromisesResolution();
    const strengthIndicatorNode = element.shadowRoot.querySelector(
      'c-description-strength-indicator'
    );
    expect(strengthIndicatorNode).not.toBeNull();
  });

  it('should display the correct value in the input', async () => {
    const element = createTestComponent();
    const expectedValue = 'Expected Value';

    await allPromisesResolution();
    const inputNode = element.shadowRoot.querySelector(
      'lightning-input-rich-text'
    );

    const inputEvent = new CustomEvent('change');
    inputNode.value = expectedValue;
    inputNode.dispatchEvent(inputEvent);

    expect(element.value).toBe(expectedValue);
  });

  describe('when the input is required', () => {
    it('should show an error when the value is empty', async () => {
      const expectedErrorMessage = 'Expected Error Message';
      const element = createTestComponent({
        required: true,
        messageWhenValueMissing: expectedErrorMessage
      });

      await allPromisesResolution();
      const inputNode = element.shadowRoot.querySelector(
        'lightning-input-rich-text'
      );
      inputNode.value = '';
      await element.validate();

      expect(inputNode.valid).toBe(false);
      expect(inputNode.messageWhenBadInput).toBe(expectedErrorMessage);
    });

    it('should show the default localized error message when the value is empty', async () => {
      const expectedErrorMessage = 'Complete this field.';
      const element = createTestComponent({
        required: true
      });

      await allPromisesResolution();
      const inputNode = element.shadowRoot.querySelector(
        'lightning-input-rich-text'
      );
      inputNode.value = '';
      await element.validate();

      expect(inputNode.valid).toBe(false);
      expect(inputNode.messageWhenBadInput).toBe(expectedErrorMessage);
    });
  });

  describe('when the input is not required', () => {
    it('should not show an error when the value is empty', async () => {
      const element = createTestComponent({
        required: false
      });

      await allPromisesResolution();
      const inputNode = element.shadowRoot.querySelector(
        'lightning-input-rich-text'
      );
      inputNode.value = '';
      await element.validate();

      expect(inputNode.valid).toBe(true);
    });
  });
});
