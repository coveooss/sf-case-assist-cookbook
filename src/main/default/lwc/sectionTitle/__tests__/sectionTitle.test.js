import { createElement } from 'lwc';
import SectionTitle from 'c/sectionTitle';

function createTestComponent() {
  const element = createElement('c-section-title', {
    is: SectionTitle
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
  '@salesforce/label/c.cookbook_SectionTitle',
  () => ({ default: 'Section title' }),
  {
    virtual: true
  }
);

describe('c-section-title', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the title text', async () => {
    const element = createTestComponent();
    const expectedTitle = 'Expected Title';
    element.title = expectedTitle;

    await flushPromises();
    const titleNode = element.shadowRoot.querySelector(
      'h2.slds-text-heading_small'
    );
    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
    await expect(element).toBeAccessible();
  });

  it('should display the label as the default value for the title', async () => {
    const element = createTestComponent();
    const expectedTitle = 'Section title';

    await flushPromises();
    const titleNode = element.shadowRoot.querySelector(
      'h2.slds-text-heading_small'
    );
    expect(titleNode).not.toBeNull();
    expect(titleNode.textContent).toBe(expectedTitle);
    await expect(element).toBeAccessible();
  });
});
