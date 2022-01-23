import { createElement } from 'lwc';
import AbandonRequestButton from 'c/abandonRequestButton';

function createTestComponent() {
  const element = createElement('c-abandon-request-button', {
    is: AbandonRequestButton
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
  '@salesforce/label/c.cookbook_AbandonRequest',
  () => ({ default: 'Abandon Request' }),
  {
    virtual: true
  }
);

describe('c-abandon-request-button', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the abandon request button', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');
    const labelNode = element.shadowRoot.querySelector('label');

    expect(buttonNode).not.toBeNull();
    expect(labelNode).toBeNull();
  });

  it('should display the correct button label', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    element.buttonLabel = expectedText;

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');

    expect(buttonNode).not.toBeNull();
    expect(buttonNode.textContent).toBe(expectedText);
    await expect(element).toBeAccessible();
  });

  it('should display the correct default button label', async () => {
    const element = createTestComponent();
    const expectedText = `Abandon Request`;

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');

    expect(buttonNode).not.toBeNull();
    expect(buttonNode.textContent).toBe(expectedText);
    await expect(element).toBeAccessible();
  });

  it('should display the correct label', async () => {
    const element = createTestComponent();
    const expectedText = 'Expected Text';
    element.label = expectedText;

    await allPromisesResolution();
    const labelNode = element.shadowRoot.querySelector('label');

    expect(labelNode).not.toBeNull();
    expect(labelNode.textContent).toBe(expectedText);
    await expect(element).toBeAccessible();
  });

  it('should display a big button when size is set to big', async () => {
    const element = createTestComponent();
    const bigButtonClass = 'big';
    element.size = 'big';

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');

    expect(buttonNode).not.toBeNull();
    expect(buttonNode.classList.contains(bigButtonClass)).toBe(true);
    await expect(element).toBeAccessible();
  });

  it('should display a small button when size is set to small', async () => {
    const element = createTestComponent();
    const bigButtonClass = 'big';
    element.size = 'small';

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');

    expect(buttonNode).not.toBeNull();
    expect(buttonNode.classList.contains(bigButtonClass)).toBe(false);
    await expect(element).toBeAccessible();
  });

  it('should open the abandon modal when clicking on the button', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('button');
    const modalNode = element.shadowRoot.querySelector('c-abandon-modal');

    expect(buttonNode).not.toBeNull();
    expect(modalNode).not.toBeNull();
    expect(modalNode.isOpen).toBe(false);

    const clickEvent = new CustomEvent('click');
    await buttonNode.dispatchEvent(clickEvent);

    expect(modalNode.isOpen).toBe(true);
    await expect(element).toBeAccessible();
  });
});
