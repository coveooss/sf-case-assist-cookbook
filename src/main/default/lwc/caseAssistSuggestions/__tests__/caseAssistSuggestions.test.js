import { createElement } from 'lwc';
import CaseAssistSuggestions from 'c/caseAssistSuggestions';

function createTestElement() {
  const element = createElement('c-case-assist-suggestions', {
    is: CaseAssistSuggestions
  });
  document.body.appendChild(element);
  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

describe('c-case-assist-suggestions', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('is rendered', () => {
    const element = createTestElement();

    const containerElement = element.shadowRoot.querySelector(
      'div.suggestions__container'
    );

    expect(containerElement).not.toBeNull();
  });

  it("doesn't crash if there are no suggestions and renders no suggestions", () => {
    const element = createTestElement();

    const containerElement = element.shadowRoot.querySelector(
      'div.suggestions__container'
    );
    expect(containerElement).not.toBeNull();

    const badges = Array.from(
      containerElement.querySelectorAll('lightning-badge')
    );
    expect(badges.length).toBe(0);
  });

  it('renders the correct number of suggestions', async () => {
    const element = createTestElement();

    const suggestions = [
      {
        label: 'foo',
        value: 'foo'
      },
      {
        label: 'bar',
        value: 'bar'
      }
    ];

    element.suggestions = suggestions;

    // Flush microtasks
    await flushPromises();
    const containerElement = element.shadowRoot.querySelector(
      'div.suggestions__container'
    );
    const badges = Array.from(
      containerElement.querySelectorAll('lightning-badge')
    );
    expect(badges.length).toBe(suggestions.length);
  });

  it('renders a suggestion correctly', async () => {
    const element = createTestElement();

    const suggestions = [
      {
        label: 'foo',
        value: 'foo'
      }
    ];

    element.suggestions = suggestions;

    // Flush microtasks
    await flushPromises();
    const containerElement = element.shadowRoot.querySelector(
      'div.suggestions__container'
    );
    const suggestionBadge = containerElement.querySelector('lightning-badge');
    expect(suggestionBadge.label).toBe(suggestions[0].label);
  });

  it('renders multiple suggestions correctly', async () => {
    const element = createTestElement();

    const suggestions = [
      {
        label: 'foo',
        value: 'foo'
      },
      {
        label: 'bar',
        value: 'bar'
      }
    ];

    element.suggestions = suggestions;

    // Flush microtasks
    await flushPromises();
    const containerElement = element.shadowRoot.querySelector(
      'div.suggestions__container'
    );
    const suggestionBadges = Array.from(
      containerElement.querySelectorAll('lightning-badge')
    );
    suggestionBadges.forEach((badge, idx) => {
      expect(badge.label).toBe(suggestionBadges[idx].label);
    });
  });

  it('should call the click event handler when clicked with the correct value', async () => {
    const element = createTestElement();
    const handler = jest.fn();
    const expectedFieldName = 'bar';
    const expectedLabel = 'foo';
    const expectedId = 'b84ed8ed-a7b1-502f-83f6-90132e68adef';
    const suggestions = [
      {
        label: expectedLabel,
        value: 'foo',
        id: expectedId
      }
    ];

    element.fieldName = expectedFieldName;
    element.suggestions = suggestions;
    element.addEventListener('selected', handler);

    // Flush microtasks
    await flushPromises();
    const containerElement = element.shadowRoot.querySelector(
      'div.suggestions__container'
    );
    const suggestionBadge = containerElement.querySelector('lightning-badge');
    suggestionBadge.dispatchEvent(new CustomEvent('click'));
    expect(handler).toHaveBeenCalled();
    const eventDetail = handler.mock.calls[0][0].detail;
    expect(eventDetail.fieldName).toBe(expectedFieldName);
    expect(eventDetail.value).toBe(suggestions[0].label);
    expect(eventDetail.id).toBe(suggestions[0].id);
  });
});
