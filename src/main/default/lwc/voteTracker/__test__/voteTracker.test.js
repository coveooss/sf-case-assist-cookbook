import { createElement } from 'lwc';
import VoteTracker from 'c/voteTracker';

function createTestComponent() {
  const element = createElement('c-vote-tracker', {
    is: VoteTracker
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
  '@salesforce/label/c.cookbook_VoteLabel',
  () => ({ default: 'Your opinion can help others' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_VoteQuestion',
  () => ({ default: 'Was this helpful?' }),
  {
    virtual: true
  }
);
jest.mock(
  '@salesforce/label/c.cookbook_VoteFinalText',
  () => ({ default: 'Thank you for the feedback!' }),
  {
    virtual: true
  }
);

jest.useFakeTimers();

describe('c-vote-tracker', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the correct label', async () => {
    const element = createTestComponent();
    const expectedLabel = `Expected Label`;
    element.label = expectedLabel;

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(labelNode).not.toBeNull();
    expect(labelNode.textContent).toBe(expectedLabel);
  });

  it('should display the default localized label', async () => {
    const element = createTestComponent();
    const expectedLabel = `Your opinion can help others`;

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(labelNode).not.toBeNull();
    expect(labelNode.textContent).toBe(expectedLabel);
  });

  it('should display the correct question', async () => {
    const element = createTestComponent();
    const expectedQuestion = `Expected Question`;
    element.question = expectedQuestion;

    await flushPromises();
    const questionNode = element.shadowRoot.querySelector('span');
    expect(questionNode).not.toBeNull();
    expect(questionNode.textContent).toBe(expectedQuestion);
  });

  it('should display the default localized question', async () => {
    const element = createTestComponent();
    const expectedQuestion = `Was this helpful?`;

    await flushPromises();
    const questionNode = element.shadowRoot.querySelector('span');
    expect(questionNode).not.toBeNull();
    expect(questionNode.textContent).toBe(expectedQuestion);
  });

  it('should display the positive voteButton', async () => {
    const element = createTestComponent();
    const expectedType = 'positive';

    await flushPromises();
    const positiveButtonNode = element.shadowRoot.querySelector(
      '.vote-tracker__positive-button'
    );
    expect(positiveButtonNode).not.toBeNull();
    expect(positiveButtonNode.type).toBe(expectedType);
  });
  it('should display the negative voteButton', async () => {
    const element = createTestComponent();
    const expectedType = 'negative';

    await flushPromises();
    const negativeButtonNode = element.shadowRoot.querySelector(
      '.vote-tracker__negative-button'
    );

    expect(negativeButtonNode).not.toBeNull();
    expect(negativeButtonNode.type).toBe(expectedType);
  });
  it('should render a small voteTracker', async () => {
    const element = createTestComponent();
    const expectedQuestionClass = `slds-text-title_bold`;
    element.size = 'small';

    await flushPromises();
    const questionNode = element.shadowRoot.querySelector('span');
    const labelNode = element.shadowRoot.querySelector(
      'h3.slds-text-title_bold'
    );
    expect(questionNode.classList.contains(expectedQuestionClass)).toBe(true);
    expect(labelNode).not.toBeNull();
  });

  it('should render a big voteTracker', async () => {
    const element = createTestComponent();
    const expectedQuestionClass = `slds-text-heading_small`;
    element.size = 'big';

    await flushPromises();
    const questionNode = element.shadowRoot.querySelector('span');
    const labelNode = element.shadowRoot.querySelector('c-section-title');
    expect(questionNode.classList.contains(expectedQuestionClass)).toBe(true);
    expect(labelNode).not.toBeNull();
  });

  describe('when the positive voteButton is clicked', () => {
    it('should change the state of the vote buttons', async () => {
      const element = createTestComponent();
      const expectedPositiveState = 'selected';
      const expectedNegativeState = 'neutral';

      await flushPromises();
      const positiveButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__positive-button'
      );
      const negativeButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__negative-button'
      );

      const clickEvent = new CustomEvent('click');
      await positiveButtonNode.dispatchEvent(clickEvent);

      expect(negativeButtonNode.state).toBe(expectedNegativeState);
      expect(positiveButtonNode.state).toBe(expectedPositiveState);
    });

    it('should switch the component to the final text', async () => {
      const element = createTestComponent();

      await flushPromises();
      const positiveButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__positive-button'
      );

      const clickEvent = new CustomEvent('click');
      await positiveButtonNode.dispatchEvent(clickEvent);

      jest.runAllTimers();

      expect(element.finalState).toBe(true);
    });

    it('should display the correct final text', async () => {
      const element = createTestComponent();
      const expectedText = 'Final Text';
      element.finalText = expectedText;

      await flushPromises();
      const positiveButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__positive-button'
      );

      const clickEvent = new CustomEvent('click');
      await positiveButtonNode.dispatchEvent(clickEvent);

      await jest.runAllTimers();
      const finalTextNode = element.shadowRoot.querySelector(
        'h3.slds-text-title_bold'
      );

      expect(finalTextNode).not.toBeNull();
      expect(finalTextNode.textContent).toBe(expectedText);
    });

    it('should display the correct default localized final text', async () => {
      const element = createTestComponent();
      const expectedText = 'Thank you for the feedback!';

      await flushPromises();
      const positiveButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__positive-button'
      );

      const clickEvent = new CustomEvent('click');
      await positiveButtonNode.dispatchEvent(clickEvent);

      await jest.runAllTimers();
      const finalTextNode = element.shadowRoot.querySelector(
        'h3.slds-text-title_bold'
      );

      expect(finalTextNode).not.toBeNull();
      expect(finalTextNode.textContent).toBe(expectedText);
    });

    it('should show the abandon button request', async () => {
      const element = createTestComponent();
      element.size = 'big';

      await flushPromises();
      const positiveButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__positive-button'
      );

      const clickEvent = new CustomEvent('click');
      await positiveButtonNode.dispatchEvent(clickEvent);

      await jest.runAllTimers();
      const buttonNode = element.shadowRoot.querySelector('c-abandon-request');

      expect(buttonNode).not.toBeNull();
    });
  });
  describe('when the negative voteButton is clicked', () => {
    it('should change the state of the voteButtons', async () => {
      const element = createTestComponent();
      const expectedPositiveState = 'neutral';
      const expectedNegativeState = 'selected';

      await flushPromises();
      const positiveButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__positive-button'
      );
      const negativeButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__negative-button'
      );

      const clickEvent = new CustomEvent('click');
      await negativeButtonNode.dispatchEvent(clickEvent);

      expect(negativeButtonNode.state).toBe(expectedNegativeState);
      expect(positiveButtonNode.state).toBe(expectedPositiveState);
    });

    it('should switch the component to the final text', async () => {
      const element = createTestComponent();

      await flushPromises();
      const negativeButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__negative-button'
      );

      const clickEvent = new CustomEvent('click');
      await negativeButtonNode.dispatchEvent(clickEvent);

      jest.runAllTimers();

      expect(element.finalState).toBe(true);
    });

    it('should display the correct final text', async () => {
      const element = createTestComponent();
      const expectedText = 'Final Text';
      element.finalText = expectedText;

      await flushPromises();
      const negativeButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__negative-button'
      );

      const clickEvent = new CustomEvent('click');
      await negativeButtonNode.dispatchEvent(clickEvent);

      await jest.runAllTimers();
      const finalTextNode = element.shadowRoot.querySelector(
        'h3.slds-text-title_bold'
      );

      expect(finalTextNode).not.toBeNull();
      expect(finalTextNode.textContent).toBe(expectedText);
    });

    it('should display the correct default localized final text', async () => {
      const element = createTestComponent();
      const expectedText = 'Thank you for the feedback!';

      await flushPromises();
      const negativeButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__negative-button'
      );

      const clickEvent = new CustomEvent('click');
      await negativeButtonNode.dispatchEvent(clickEvent);

      await jest.runAllTimers();
      const finalTextNode = element.shadowRoot.querySelector(
        'h3.slds-text-title_bold'
      );

      expect(finalTextNode).not.toBeNull();
      expect(finalTextNode.textContent).toBe(expectedText);
    });
    it('should not show the abandon button request', async () => {
      const element = createTestComponent();
      element.size = 'big';

      await flushPromises();
      const negativeButtonNode = element.shadowRoot.querySelector(
        '.vote-tracker__negative-button'
      );

      const clickEvent = new CustomEvent('click');
      await negativeButtonNode.dispatchEvent(clickEvent);

      await jest.runAllTimers();
      const buttonNode = element.shadowRoot.querySelector('c-abandon-request');

      expect(buttonNode).toBeNull();
    });
  });
});
