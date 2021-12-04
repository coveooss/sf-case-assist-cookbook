import { createElement } from 'lwc';
import navigationButton from 'c/navigationButton';

function createTestComponent(props = {}) {
  const element = createElement('c-navigationButton', {
    is: navigationButton
  });

  document.body.appendChild(element);
  Object.keys(props).forEach((key) => {
    element[key] = props[key];
  });

  return element;
}

// Helper function to wait until the microtask queue is empty.
function allPromisesResolution() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

jest.mock('@salesforce/label/c.cookbook_Next', () => ({ default: 'Next' }), {
  virtual: true
});
jest.mock('@salesforce/label/c.cookbook_Back', () => ({ default: 'Back' }), {
  virtual: true
});

describe('c-navigation-button', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should display the lightning button', async () => {
    const element = createTestComponent();

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('lightning-button');
    expect(buttonNode).not.toBeNull();
  });

  it('should display the correct label', async () => {
    const expectedLabel = 'Next';
    const element = createTestComponent({
      label: expectedLabel
    });

    await allPromisesResolution();
    const buttonNode = element.shadowRoot.querySelector('lightning-button');
    expect(buttonNode).not.toBeNull();
    expect(buttonNode.label).toBe(expectedLabel);
  });

  describe('when the type of the navigation button is next', () => {
    it('should display the correct localized label', async () => {
      const expectedLabel = 'Next';
      const element = createTestComponent({
        type: 'next'
      });

      await allPromisesResolution();
      const buttonNode = element.shadowRoot.querySelector('lightning-button');
      expect(buttonNode).not.toBeNull();
      expect(buttonNode.label).toBe(expectedLabel);
    });

    it('should display the correct icon in the correct position', async () => {
      const expectedIcon = 'utility:chevronright';
      const expectedPosition = 'right';
      const element = createTestComponent({
        type: 'next',
        showIcon: true
      });

      await allPromisesResolution();
      const buttonNode = element.shadowRoot.querySelector('lightning-button');
      expect(buttonNode).not.toBeNull();
      expect(buttonNode.iconPosition).toBe(expectedPosition);
      expect(buttonNode.iconName).toBe(expectedIcon);
    });

    it('should display the lightning button in the correct variant', async () => {
      const expectedVariant = 'brand';
      const element = createTestComponent({
        type: 'next'
      });

      await allPromisesResolution();
      const buttonNode = element.shadowRoot.querySelector('lightning-button');
      expect(buttonNode).not.toBeNull();
      expect(buttonNode.variant).toBe(expectedVariant);
    });
  });

  describe('when the type of the navigation button is previous', () => {
    it('should display the correct localized label', async () => {
      const expectedLabel = 'Back';
      const element = createTestComponent({
        type: 'previous'
      });

      await allPromisesResolution();
      const buttonNode = element.shadowRoot.querySelector('lightning-button');
      expect(buttonNode).not.toBeNull();
      expect(buttonNode.label).toBe(expectedLabel);
    });

    it('should display the correct icon in the correct position', async () => {
      const expectedIcon = 'utility:chevronleft';
      const expectedPosition = 'left';
      const element = createTestComponent({
        type: 'previous',
        showIcon: true
      });

      await allPromisesResolution();
      const buttonNode = element.shadowRoot.querySelector('lightning-button');
      expect(buttonNode).not.toBeNull();
      expect(buttonNode.iconPosition).toBe(expectedPosition);
      expect(buttonNode.iconName).toBe(expectedIcon);
    });

    it('should display the lightning button in the correct variant', async () => {
      const expectedVariant = 'base';
      const element = createTestComponent({
        type: 'previous'
      });

      await allPromisesResolution();
      const buttonNode = element.shadowRoot.querySelector('lightning-button');
      expect(buttonNode).not.toBeNull();
      expect(buttonNode.variant).toBe(expectedVariant);
    });
  });
});
