import { createElement } from 'lwc';
import DescriptionStrengthIndicator from 'c/descriptionStrengthIndicator';

function createTestComponent() {
  const element = createElement('c-description-strength-indicator', {
    is: DescriptionStrengthIndicator
  });
  document.body.appendChild(element);

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

  it('should display the initial message', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    element.initialMessage = expectedText;

    await allPromisesResolution();
    const messageNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(messageNode).not.toBeNull();
    expect(messageNode.textContent).toBe(expectedText);
  });

  it('should display the default localized value of the initial message', async () => {
    const element = createTestComponent();
    const expectedText = 'Provide details';

    await allPromisesResolution();
    const messageNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(messageNode).not.toBeNull();
    expect(messageNode.textContent).toBe(expectedText);
  });

  it('should display the keep going message', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    const keepGoingThreshold = 50;
    const progress = 50;
    element.keepGoingMessage = expectedText;
    element.progress = progress;
    element.keepGoingThreshold = keepGoingThreshold;

    await allPromisesResolution();
    const messageNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(messageNode).not.toBeNull();
    expect(messageNode.textContent).toBe(expectedText);
  });

  it('should display the default localized value of the keep going message', async () => {
    const element = createTestComponent();
    const expectedText = 'Provide more details';
    const keepGoingThreshold = 50;
    const progress = 50;
    element.progress = progress;
    element.keepGoingThreshold = keepGoingThreshold;

    await allPromisesResolution();
    const messageNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(messageNode).not.toBeNull();
    expect(messageNode.textContent).toBe(expectedText);
  });

  it('should display the final message', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    const progress = 100;
    element.finalMessage = expectedText;
    element.progress = progress;

    await allPromisesResolution();
    const messageNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(messageNode).not.toBeNull();
    expect(messageNode.textContent).toBe(expectedText);
  });

  it('should display the default localized value of the final message', async () => {
    const element = createTestComponent();
    const expectedText = 'Thank you!';
    const progress = 100;
    element.progress = progress;

    await allPromisesResolution();
    const messageNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(messageNode).not.toBeNull();
    expect(messageNode.textContent).toBe(expectedText);
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
  });

  it('should display the progress indicator full', async () => {
    const element = createTestComponent();
    const progress = 100;
    element.progress = progress;

    await allPromisesResolution();
    const fullProgressRingNode = element.shadowRoot.querySelector(
      'lightning-progress-ring'
    );
    const progressRingNode = element.shadowRoot.querySelector(
      '.slds-progress-ring'
    );

    expect(fullProgressRingNode).not.toBeNull();
    expect(progressRingNode).toBeNull();
  });

  it('should display the help accordion', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const accordionNode = element.shadowRoot.querySelector(
      'lightning-accordion'
    );
    expect(accordionNode).not.toBeNull();
  });

  it('should display the help label', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    element.helpLabel = expectedText;

    await allPromisesResolution();
    const accordionNode = element.shadowRoot.querySelector(
      'lightning-accordion-section'
    );
    expect(accordionNode).not.toBeNull();
    expect(accordionNode.label).toBe(expectedText);
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
  });
});
