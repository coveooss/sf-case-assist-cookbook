import { createElement } from 'lwc';
import CreateCaseButton from 'c/createCaseButton';

function createTestComponent() {
  const element = createElement('c-create-case-button', {
    is: CreateCaseButton
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
  '@salesforce/label/c.cookbook_CreateCase',
  () => ({ default: 'Create Case' }),
  {
    virtual: true
  }
);

describe('c-create-case-button', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the button with the correct button text', async () => {
    const element = createTestComponent();
    const expectedLabel = 'Expected Label';
    element.buttonLabel = expectedLabel;

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');
    const labelNode = element.shadowRoot.querySelector('label');

    expect(buttonNode).not.toBeNull();
    expect(labelNode).toBeNull();
    expect(buttonNode.textContent).toBe(expectedLabel);
    await expect(element).toBeAccessible();
  });

  it('should display the button with the correct default button text', async () => {
    const element = createTestComponent();
    const expectedLabel = 'Create Case';

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');
    const labelNode = element.shadowRoot.querySelector('label');

    expect(buttonNode).not.toBeNull();
    expect(labelNode).toBeNull();
    expect(buttonNode.textContent).toBe(expectedLabel);
    await expect(element).toBeAccessible();
  });

  it('should display the correct label', async () => {
    const element = createTestComponent();
    const expectedLabel = 'Still need help?';
    element.label = expectedLabel;

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');
    const labelNode = element.shadowRoot.querySelector('label');

    expect(buttonNode).not.toBeNull();
    expect(labelNode).not.toBeNull();
    expect(labelNode.textContent).toBe(expectedLabel);
    await expect(element).toBeAccessible();
  });

  it('should display a big button when size is set to big', async () => {
    const element = createTestComponent();
    const bigSizeClass = 'big';
    element.size = 'big';

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');

    expect(buttonNode).not.toBeNull();
    expect(buttonNode.classList.contains(bigSizeClass)).toBe(true);
    await expect(element).toBeAccessible();
  });

  it('should display a small button when size is set to small', async () => {
    const element = createTestComponent();
    const bigSizeClass = 'big';
    element.size = 'small';

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');

    expect(buttonNode).not.toBeNull();
    expect(buttonNode.classList.contains(bigSizeClass)).toBe(false);
    await expect(element).toBeAccessible();
  });
});
