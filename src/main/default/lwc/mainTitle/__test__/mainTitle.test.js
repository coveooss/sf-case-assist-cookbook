import { createElement } from 'lwc';
import MainTitle from 'c/mainTitle';

function createTestComponent() {
  const element = createElement('c-main-title', {
    is: MainTitle
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
  '@salesforce/label/c.cookbook_MainTitle',
  () => ({ default: 'Hi, what do you need help with?' }),
  {
    virtual: true
  }
);

describe('c-main-title', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the correct value of the title', async () => {
    const element = createTestComponent();
    const expectedTitle = 'Expected Title';
    element.title = expectedTitle;

    await allPromisesResolution();
    const titleNode = element.shadowRoot.querySelector(
      'h1.slds-text-heading_large'
    );
    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
  });

  it('should display the correct default value of the title', async () => {
    const element = createTestComponent();
    const expectedTitle = 'Hi, what do you need help with?';

    await allPromisesResolution();
    const titleNode = element.shadowRoot.querySelector(
      'h1.slds-text-heading_large'
    );
    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
  });

  it('should not display the subtitle', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const subtitleNode = element.shadowRoot.querySelector(
      'h2.slds-text-heading_small'
    );
    expect(subtitleNode).toBeNull();
  });

  it('should display the correct value of the subtitle', async () => {
    const element = createTestComponent();
    const expectedSubtitle = 'Expected Subtitle';
    element.subtitle = expectedSubtitle;

    await allPromisesResolution();
    const subtitleNode = element.shadowRoot.querySelector(
      'h2.slds-text-heading_small'
    );
    expect(subtitleNode).not.toBeNull();
    expect(subtitleNode.textContent).toBe(expectedSubtitle);
  });
});
