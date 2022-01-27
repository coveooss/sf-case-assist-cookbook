import { createElement } from 'lwc';
import DescriptionStrengthIndicator from 'c/descriptionStrengthIndicator';

function createTestComponent(props = {}) {
  const element = createElement('c-description-strength-indicator', {
    is: DescriptionStrengthIndicator
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
  '@salesforce/label/c.cookbook_ProvideDetails',
  () => ({ default: 'Provide details' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_ProvideMoreDetails',
  () => ({ default: 'Provide more details' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_ThankYou',
  () => ({ default: 'Thank you!' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_DontKnowWhatToWrite',
  () => ({ default: "Don't know what to write?" }),
  {
    virtual: true
  }
);

describe('c-description-strength-indicator', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('when the progress is less than the keep going threshold', () => {
    it('should display the initial message', async () => {
      const expectedText = 'Expected Text';
      const element = createTestComponent({
        initialMessage: expectedText
      });

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector('.indicator_title');
      expect(messageNode).not.toBeNull();
      expect(messageNode.textContent).toBe(expectedText);
      await expect(element).toBeAccessible();
    });

    it('should display the default localized value of the initial message', async () => {
      const element = createTestComponent();
      const expectedText = 'Provide details';

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector('.indicator_title');
      expect(messageNode).not.toBeNull();
      expect(messageNode.textContent).toBe(expectedText);
      await expect(element).toBeAccessible();
    });

    it('should display the progress indicator', async () => {
      const element = createTestComponent();

      await allPromisesResolution();
      const progressRingNode = element.shadowRoot.querySelector(
        '.slds-progress-ring'
      );
      const fullProgressRingNode = element.shadowRoot.querySelector(
        'lightning-progress-ring'
      );
      expect(progressRingNode).not.toBeNull();
      expect(fullProgressRingNode).toBeNull();
      await expect(element).toBeAccessible();
    });

    it('should display the help accordion', async () => {
      const element = createTestComponent();

      await allPromisesResolution();
      const accordionNode = element.shadowRoot.querySelector(
        'lightning-accordion'
      );
      expect(accordionNode).not.toBeNull();
      await expect(element).toBeAccessible();
    });

    it('should display the help label', async () => {
      const expectedText = 'Expected Text';
      const element = createTestComponent({
        helpLabel: expectedText
      });

      await allPromisesResolution();
      const accordionNode = element.shadowRoot.querySelector(
        'lightning-accordion-section'
      );
      expect(accordionNode).not.toBeNull();
      expect(accordionNode.label).toBe(expectedText);
      await expect(element).toBeAccessible();
    });

    it('should display the default localized value of the help label', async () => {
      const element = createTestComponent();
      const expectedText = "Don't know what to write?";

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector(
        'lightning-accordion-section'
      );
      expect(messageNode).not.toBeNull();
      expect(messageNode.label).toBe(expectedText);
      await expect(element).toBeAccessible();
    });
  });

  describe('the keep going threshold', () => {
    it('should display the keep going message', async () => {
      const expectedText = 'Expected Text';
      const element = createTestComponent({
        keepGoingMessage: expectedText,
        progress: 50,
        keepGoingThreshold: 50
      });

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector('.indicator_title');
      expect(messageNode).not.toBeNull();
      expect(messageNode.textContent).toBe(expectedText);
      await expect(element).toBeAccessible();
    });

    it('should display the default localized value of the keep going message', async () => {
      const expectedText = 'Provide more details';
      const element = createTestComponent({
        progress: 50,
        keepGoingThreshold: 50
      });

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector('.indicator_title');
      expect(messageNode).not.toBeNull();
      expect(messageNode.textContent).toBe(expectedText);
      await expect(element).toBeAccessible();
    });
  });

  describe('when the indicator is full', () => {
    it('should display the final message', async () => {
      const expectedText = 'Expected Text';
      const element = createTestComponent({
        progress: 100,
        finalMessage: expectedText
      });

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector('.indicator_title');
      expect(messageNode).not.toBeNull();
      expect(messageNode.textContent).toBe(expectedText);
      await expect(element).toBeAccessible();
    });

    it('should display the default localized value of the final message', async () => {
      const element = createTestComponent({
        progress: 100
      });
      const expectedText = 'Thank you!';

      await allPromisesResolution();
      const messageNode = element.shadowRoot.querySelector('.indicator_title');
      expect(messageNode).not.toBeNull();
      expect(messageNode.textContent).toBe(expectedText);
      await expect(element).toBeAccessible();
    });

    it('should display the progress indicator full', async () => {
      const element = createTestComponent({
        progress: 100
      });

      await allPromisesResolution();
      const fullProgressRingNode = element.shadowRoot.querySelector(
        'lightning-progress-ring'
      );
      const progressRingNode = element.shadowRoot.querySelector(
        '.slds-progress-ring'
      );

      expect(fullProgressRingNode).not.toBeNull();
      expect(progressRingNode).toBeNull();
      await expect(element).toBeAccessible();
    });
  });
});
