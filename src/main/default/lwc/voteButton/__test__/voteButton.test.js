import { createElement } from 'lwc';
import VoteButton from 'c/voteButton';

const labelClasses = {
  initial: 'text-color_initial',
  neutral: 'slds-text-color_weak',
  selectedPositive: 'slds-text-color_success',
  selectedNegative: 'slds-text-color_error',
  big: 'slds-text-heading_small',
  small: 'label_small'
};
const iconVariants = {
  initial: '',
  neutral: '',
  selectedPositive: 'success',
  selectedNegative: 'error'
};
const iconClasses = {
  big: 'slds-m-right_x-small',
  small: 'slds-m-right_xx-small',
  initial: 'icon-color_initial'
};

function createTestComponent() {
  const element = createElement('c-vote-button', {
    is: VoteButton
  });
  document.body.appendChild(element);

  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

jest.mock('@salesforce/label/c.cookbook_Yes', () => ({ default: 'Yes' }), {
  virtual: true
});

describe('c-vote-button', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  it('should render the icon', () => {
    const element = createTestComponent();

    const iconNode = element.shadowRoot.querySelector('lightning-icon');
    expect(iconNode).not.toBeNull();
  });

  it('should render the label', async () => {
    const element = createTestComponent();

    const expectedLabel = 'Expected Label';
    element.label = expectedLabel;

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    expect(labelNode).not.toBeNull();
    expect(labelNode.textContent).toBe(expectedLabel);
  });

  it('should render the default localizzed label', async () => {
    const element = createTestComponent();

    const expectedLabel = 'Yes';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    expect(labelNode).not.toBeNull();
    expect(labelNode.textContent).toBe(expectedLabel);
  });

  it('should render the a big voteButton', async () => {
    const element = createTestComponent();

    const expectedIconSize = 'x-small';
    element.size = 'big';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    const iconNode = element.shadowRoot.querySelector('lightning-icon');

    expect(iconNode.size).toBe(expectedIconSize);
    expect(labelNode.classList.contains(labelClasses.big)).toBe(true);
    expect(labelNode.classList.contains(labelClasses.small)).toBe(false);
    expect(iconNode.classList.contains(iconClasses.big)).toBe(true);
    expect(iconNode.classList.contains(iconClasses.small)).toBe(false);
  });

  it('should render the a small voteButton', async () => {
    const element = createTestComponent();

    const expectedIconSize = 'xx-small';
    element.size = 'small';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    const iconNode = element.shadowRoot.querySelector('lightning-icon');

    expect(iconNode.size).toBe(expectedIconSize);
    expect(labelNode.classList.contains(labelClasses.big)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.small)).toBe(true);
    expect(iconNode.classList.contains(iconClasses.big)).toBe(false);
    expect(iconNode.classList.contains(iconClasses.small)).toBe(true);
  });

  it('should render the a voteButton in the initial state', async () => {
    const element = createTestComponent();

    element.state = 'initial';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    const iconNode = element.shadowRoot.querySelector('lightning-icon');

    expect(iconNode.variant).toBe(iconVariants.initial);
    expect(iconNode.classList.contains(iconClasses.initial)).toBe(true);
    expect(labelNode.classList.contains(labelClasses.initial)).toBe(true);
    expect(labelNode.classList.contains(labelClasses.neutral)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.selectedPositive)).toBe(
      false
    );
    expect(labelNode.classList.contains(labelClasses.selectedNegative)).toBe(
      false
    );
  });
  it('should render the a voteButton in the neutral state', async () => {
    const element = createTestComponent();

    element.state = 'neutral';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    const iconNode = element.shadowRoot.querySelector('lightning-icon');

    expect(iconNode.variant).toBe(iconVariants.neutral);
    expect(iconNode.classList.contains(iconClasses.initial)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.initial)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.neutral)).toBe(true);
    expect(labelNode.classList.contains(labelClasses.selectedPositive)).toBe(
      false
    );
    expect(labelNode.classList.contains(labelClasses.selectedNegative)).toBe(
      false
    );
  });

  it('should render the a positive voteButton in the selected state', async () => {
    const element = createTestComponent();

    element.type = 'positive';
    element.state = 'selected';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    const iconNode = element.shadowRoot.querySelector('lightning-icon');

    expect(iconNode.variant).toBe(iconVariants.selectedPositive);
    expect(iconNode.classList.contains(iconClasses.initial)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.initial)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.neutral)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.selectedPositive)).toBe(
      true
    );
    expect(labelNode.classList.contains(labelClasses.selectedNegative)).toBe(
      false
    );
  });
  it('should render the a negative voteButton in the selected state', async () => {
    const element = createTestComponent();

    element.type = 'negative';
    element.state = 'selected';

    await flushPromises();
    const labelNode = element.shadowRoot.querySelector('span');
    const iconNode = element.shadowRoot.querySelector('lightning-icon');

    expect(iconNode.variant).toBe(iconVariants.selectedNegative);
    expect(iconNode.classList.contains(iconClasses.initial)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.initial)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.neutral)).toBe(false);
    expect(labelNode.classList.contains(labelClasses.selectedPositive)).toBe(
      false
    );
    expect(labelNode.classList.contains(labelClasses.selectedNegative)).toBe(
      true
    );
  });
});
