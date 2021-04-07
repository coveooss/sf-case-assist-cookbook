import { createElement } from 'lwc';
import AnalyticsBeacon from 'c/analyticsBeacon';

describe('c-analytics-beacon', () => {
  afterEach(() => {
    // Clear mocks so that every test run has a clean implementation.
    jest.clearAllMocks();

    // The jsdom instance is shared across test cases in a single file so reset the DOM.
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    return Promise.resolve();
  });

  it('is accessible', () => {
    // Create element
    const element = createElement('c-analytics-beacon', {
      is: AnalyticsBeacon
    });
    document.body.appendChild(element);

    return Promise.resolve().then(() => expect(window.coveoua).not.toBeNull());
  });
});
