import { createElement } from 'lwc';
import FlowProgressIndicator from 'c/flowProgressIndicator';

function createTestComponent() {
  const element = createElement('c-flow-progress-indicator', {
    is: FlowProgressIndicator
  });
  document.body.appendChild(element);

  return element;
}

// Helper function to wait until the microtask queue is empty.
function allPromisesResolution() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

jest.mock('@salesforce/label/c.cookbook_LogIn', () => ({ default: 'Log in' }), {
  virtual: true
});
jest.mock(
  '@salesforce/label/c.cookbook_DescribeProblem',
  () => ({ default: 'Describe problem' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_ProvideDetails',
  () => ({ default: 'Provide details' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_ReviewHelp',
  () => ({ default: 'Review help' }),
  {
    virtual: true
  }
);

const DEFAULT_STEPS = [
  {
    label: 'Log in',
    value: 'log in'
  },
  {
    label: 'Describe problem',
    value: 'describe problem'
  },
  {
    label: 'Provide details',
    value: 'provide details'
  },
  {
    label: 'Review help',
    value: 'review help'
  }
];

const CUSTOM_STEPS = [
  {
    label: 'First step',
    value: 'first step'
  },
  {
    label: 'Second step',
    value: 'second step'
  }
];

const assertProgressStepEquals = (actual, expected) => {
  expect(actual).not.toBeNull();
  expect(actual.label).toBe(expected.label);
  expect(actual.value).toBe(expected.value);
};

describe('c-flow-progress-indicator', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the progress indicator', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const progressIndicatorNode = element.shadowRoot.querySelector(
      'lightning-progress-indicator'
    );

    expect(progressIndicatorNode).not.toBeNull();
    await expect(element).toBeAccessible();
  });

  it('should display the correct default progress indicator steps', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const progressIndicatorNode = element.shadowRoot.querySelector(
      'lightning-progress-indicator'
    );
    const stepNodes = element.shadowRoot.querySelectorAll(
      'lightning-progress-step'
    );

    expect(progressIndicatorNode).not.toBeNull();
    expect(stepNodes.length).toBe(DEFAULT_STEPS.length);
    stepNodes.forEach((step, idx) =>
      assertProgressStepEquals(step, DEFAULT_STEPS[idx])
    );
    await expect(element).toBeAccessible();
  });

  it('should display the correct progress indicator steps', async () => {
    const element = createTestComponent();
    element.steps = CUSTOM_STEPS;

    await allPromisesResolution();
    const progressIndicatorNode = element.shadowRoot.querySelector(
      'lightning-progress-indicator'
    );
    const stepNodes = element.shadowRoot.querySelectorAll(
      'lightning-progress-step'
    );

    expect(progressIndicatorNode).not.toBeNull();
    expect(stepNodes.length).toBe(CUSTOM_STEPS.length);
    stepNodes.forEach((step, idx) =>
      assertProgressStepEquals(step, CUSTOM_STEPS[idx])
    );
    await expect(element).toBeAccessible();
  });

  it('should display an error in the current step when triggering an error', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const progressIndicatorNode = element.shadowRoot.querySelector(
      'lightning-progress-indicator'
    );

    await element.triggerError(true);
    expect(progressIndicatorNode).not.toBeNull();
    expect(progressIndicatorNode.hasError).toBe(true);
    await expect(element).toBeAccessible();
  });

  it('should display the correct current step', async () => {
    const element = createTestComponent();
    const step = 'provide details';
    element.currentStep = step;

    await allPromisesResolution();
    const progressIndicatorNode = element.shadowRoot.querySelector(
      'lightning-progress-indicator'
    );

    await element.triggerError(true);
    expect(progressIndicatorNode).not.toBeNull();
    expect(progressIndicatorNode.currentStep).toBe(step);
    await expect(element).toBeAccessible();
  });
});
