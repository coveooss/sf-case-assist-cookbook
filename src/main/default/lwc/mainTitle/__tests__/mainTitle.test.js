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
  () => ({ default: 'Hi, how may we help you?' }),
  {
    virtual: true
  }
);

const titleSelector = 'h1.slds-text-heading_large';
const subtitleSelector = 'h2.slds-text-heading_small';

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
    const titleNode = element.shadowRoot.querySelector(titleSelector);

    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
    await expect(element).toBeAccessible();
  });

  it('should display the correct default value of the title', async () => {
    const element = createTestComponent();
    const expectedTitle = 'Hi, how may we help you?';

    await allPromisesResolution();
    const titleNode = element.shadowRoot.querySelector(titleSelector);

    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
    await expect(element).toBeAccessible();
  });

  it('should not display the subtitle if the option is not set', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const subtitleNode = element.shadowRoot.querySelector(subtitleSelector);

    expect(subtitleNode).toBeNull();
    await expect(element).toBeAccessible();
  });

  it('should display the correct value of the subtitle', async () => {
    const element = createTestComponent();
    const expectedSubtitle = 'Expected Subtitle';
    element.subtitle = expectedSubtitle;

    await allPromisesResolution();
    const subtitleNode = element.shadowRoot.querySelector(subtitleSelector);

    expect(subtitleNode).not.toBeNull();
    expect(subtitleNode.textContent).toBe(expectedSubtitle);
    await expect(element).toBeAccessible();
  });

  it('should align the title and the subtitle to the center when alignCenter is set to true', async () => {
    const element = createTestComponent();
    const expectedSubtitle = 'Expected Subtitle';
    const alignCenterClass = 'slds-align_absolute-center';
    element.subtitle = expectedSubtitle;
    element.alignCenter = true;

    await allPromisesResolution();
    const titleNode = element.shadowRoot.querySelector(titleSelector);
    const subtitleNode = element.shadowRoot.querySelector(subtitleSelector);

    expect(titleNode).not.toBeNull();
    expect(subtitleNode).not.toBeNull();
    expect(titleNode.classList.contains(alignCenterClass)).toBe(true);
    expect(subtitleNode.classList.contains(alignCenterClass)).toBe(true);
    await expect(element).toBeAccessible();
  });

  it('should not align the title and the subtitle to the center when alignCenter is set to false', async () => {
    const element = createTestComponent();
    const expectedSubtitle = 'Expected Subtitle';
    const alignCenterClass = 'slds-align_absolute-center';
    element.subtitle = expectedSubtitle;
    element.alignCenter = false;

    await allPromisesResolution();
    const titleNode = element.shadowRoot.querySelector(titleSelector);
    const subtitleNode = element.shadowRoot.querySelector(subtitleSelector);

    expect(titleNode).not.toBeNull();
    expect(subtitleNode).not.toBeNull();
    expect(titleNode.classList.contains(alignCenterClass)).toBe(false);
    expect(subtitleNode.classList.contains(alignCenterClass)).toBe(false);
    await expect(element).toBeAccessible();
  });
});
