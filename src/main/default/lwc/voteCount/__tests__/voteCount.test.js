import { createElement } from 'lwc';
import VoteCount from 'c/voteCount';

function createTestComponent() {
  const element = createElement('c-vote-count', {
    is: VoteCount
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
  '@salesforce/label/c.cookbook_HelpedUsers_plural',
  () => ({ default: 'Helped 102 users' }),
  {
    virtual: true
  }
);

jest.mock(
  '@salesforce/label/c.cookbook_HelpedUsers',
  () => ({ default: 'Helped 1 user' }),
  {
    virtual: true
  }
);

jest.mock(
  '@salesforce/label/c.cookbook_HelpedUsers_zero',
  () => ({ default: 'Helped no one' }),
  {
    virtual: true
  }
);

describe('c-vote-count', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the correct count of votes when there is multiples votes', async () => {
    const element = createTestComponent();
    const count = 102;
    const expectedText = `Helped ${count} users`;
    element.count = count;

    await flushPromises();
    const textNode = element.shadowRoot.querySelector('.slds-grid > div');
    expect(textNode).not.toBeNull();
    expect(textNode.textContent).toBe(expectedText);
  });

  it('should display the correct count of votes when there only one vote', async () => {
    const element = createTestComponent();
    const count = 1;
    const expectedText = `Helped 1 user`;
    element.count = count;

    await flushPromises();
    const textNode = element.shadowRoot.querySelector('.slds-grid > div');
    expect(textNode).not.toBeNull();
    expect(textNode.textContent).toBe(expectedText);
  });

  it('should display the correct count of votes when there is zero vote', async () => {
    const element = createTestComponent();
    const count = 0;
    const expectedText = `Helped no one`;
    element.count = count;

    await flushPromises();
    const textNode = element.shadowRoot.querySelector('.slds-grid > div');
    expect(textNode).not.toBeNull();
    expect(textNode.textContent).toBe(expectedText);
  });

  it('should display the component in green when the component is active', async () => {
    const element = createTestComponent();
    const count = 102;
    const expectedVariant = 'success';
    const expectedClass = 'slds-text-color_success';
    element.count = count;
    element.active = true;

    await flushPromises();
    const iconNode = element.shadowRoot.querySelector('lightning-icon');
    const textNode = element.shadowRoot.querySelector('.slds-grid > div');

    expect(iconNode).not.toBeNull();
    expect(textNode).not.toBeNull();
    expect(textNode.classList.contains(expectedClass)).toBe(true);
    expect(iconNode.variant).toBe(expectedVariant);
  });

  it('should display the component in grey when the component is not active', async () => {
    const element = createTestComponent();
    const count = 102;
    const expectedVariant = '';
    const expectedClass = 'view-count_label-neutral';
    element.count = count;
    element.active = false;

    await flushPromises();
    const iconNode = element.shadowRoot.querySelector('lightning-icon');
    const textNode = element.shadowRoot.querySelector('.slds-grid > div');

    expect(iconNode).not.toBeNull();
    expect(textNode).not.toBeNull();
    expect(textNode.classList.contains(expectedClass)).toBe(true);
    expect(iconNode.variant).toBe(expectedVariant);
  });
});
