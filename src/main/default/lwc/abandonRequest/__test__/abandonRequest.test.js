import { createElement } from 'lwc';
import AbandonRequest from 'c/abandonRequest';

function createTestComponent() {
  const element = createElement('c-abandon-request', {
    is: AbandonRequest
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
  '@salesforce/label/c.cookbook_AbandonRequest',
  () => ({ default: 'Abandon Request' }),
  {
    virtual: true
  }
);

describe('c-abandon-request', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the abandon request button', async () => {
    const element = createTestComponent();

    await flushPromises();
    const buttonNode = element.shadowRoot.querySelector('lightning-button');
    expect(buttonNode).not.toBeNull();
  });

  it('should display the label of the abandon request button', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    element.label = expectedText;

    await flushPromises();
    const buttonNode = element.shadowRoot.querySelector('lightning-button');
    expect(buttonNode).not.toBeNull();
    expect(buttonNode.label).toBe(expectedText);
  });

  it('should display the default localized label', async () => {
    const element = createTestComponent();
    const expectedText = `Abandon Request`;

    await flushPromises();
    const buttonNode = element.shadowRoot.querySelector('lightning-button');
    expect(buttonNode).not.toBeNull();
    expect(buttonNode.label).toBe(expectedText);
  });
});
