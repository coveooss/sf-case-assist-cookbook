import { createElement } from 'lwc';
import CaseEnd from 'c/caseEnd';

function createTestComponent() {
  const element = createElement('c-case-end', {
    is: CaseEnd
  });
  document.body.appendChild(element);

  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

describe('c-case-end', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render the icon', () => {
    const element = createTestComponent();

    const theIcon = element.shadowRoot.querySelector('lightning-icon');
    expect(theIcon).not.toBeNull();
  });

  it('should display the heading text', async () => {
    const element = createTestComponent();

    const expectedTitle = 'Expected Title';
    element.heading = expectedTitle;

    // Flush microtasks
    await flushPromises();
    const titleNode = element.shadowRoot.querySelector(
      'div.slds-text-heading_large'
    );
    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
  });

  it('should display the subText', async () => {
    const element = createTestComponent();

    const expectedSubText = 'Expected Sub Text';
    element.subText = expectedSubText;

    // Flush microtasks
    await flushPromises();
    const subTextNode = element.shadowRoot.querySelector(
      'div.slds-text-body_regular'
    );
    expect(subTextNode).not.toBeNull();
    expect(subTextNode.textContent).toBe(expectedSubText);
  });
});
