import { createElement } from 'lwc';
import AbandonModal from 'c/abandonModal';

function createTestComponent() {
  const element = createElement('c-abandon-modal', {
    is: AbandonModal
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
  '@salesforce/label/c.cookbook_GladYouFoundAnswer',
  () => ({ default: "We're glad you found the answer!" }),
  {
    virtual: true
  }
);

describe('c-abandon-modal', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the correct default value of the header', async () => {
    const element = createTestComponent();
    const expectedHeader = "We're glad you found the answer!";

    await allPromisesResolution();
    const headerNode = element.shadowRoot.querySelector('.slds-modal__title');

    expect(headerNode).not.toBeNull();
    expect(headerNode.textContent).toBe(expectedHeader);
    await expect(element).toBeAccessible();
  });

  it('should display the correct custom value of the header', async () => {
    const element = createTestComponent();
    const expectedHeader = 'Expected header';
    element.headerLabel = expectedHeader;

    await allPromisesResolution();
    const headerNode = element.shadowRoot.querySelector('.slds-modal__title');

    expect(headerNode).not.toBeNull();
    expect(headerNode.textContent).toBe(expectedHeader);
    await expect(element).toBeAccessible();
  });

  it('should open the modal when openModal method is called and close it when closeModal is called', async () => {
    const element = createTestComponent();

    await allPromisesResolution();

    expect(element.isOpen).toBe(false);

    await element.openModal();
    expect(element.isOpen).toBe(true);
    await expect(element).toBeAccessible();

    await element.closeModal();
    expect(element.isOpen).toBe(false);
    await expect(element).toBeAccessible();
  });
});
