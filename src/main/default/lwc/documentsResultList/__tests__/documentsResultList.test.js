import { createElement } from 'lwc';
import DocumentsResultList from 'c/documentsResultList';

const MOCK_RESULT = {
  title: 'title',
  uniqueId: '12345',
  excerpt: 'excerpt'
};

function createComponent() {
  const element = createElement('c-documents-result-list', {
    is: DocumentsResultList
  });
  document.body.appendChild(element);

  return element;
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

describe('c-documents-result-list', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should not crash without results', () => {
    const element = createComponent();
    expect(element.firstChild).toBeNull();
  });

  it('should render 1 result', async () => {
    const element = createComponent();

    const expectedResult = { ...MOCK_RESULT };
    element.results = [expectedResult];

    // Flush microtasks
    await flushPromises();
    const titleNode = element.shadowRoot.querySelector(
      'div[data-ut-role="resultListContainer"]'
    );
    expect(titleNode.firstChild).not.toBeNull();
  });

  it('should render the correct number of results', async () => {
    const element = createComponent();

    const expectedResultsArray = [1, 2, 3, 4];
    const expectedResults = expectedResultsArray.map((result) => ({
      uniqueId: result
    }));
    element.results = expectedResults;

    // Flush microtasks
    await flushPromises();
    const resultContainerNodes = Array.from(
      element.shadowRoot.querySelectorAll(
        'div[data-ut-role="resultListContainer"]'
      )
    );
    expect(resultContainerNodes.length).toBe(expectedResults.length);
  });

  it('should emit the resultclicked event on a result click', async () => {
    const resultClickedHandler = jest.fn();
    const element = createComponent();

    const expectedResult = { ...MOCK_RESULT, rank: 0 };
    element.results = [expectedResult];

    // Flush microtasks
    await flushPromises();

    element.addEventListener('resultclicked', resultClickedHandler);

    const resultTitleNode = element.shadowRoot.querySelector(
      'a[data-role="result-title"]'
    );
    if (resultTitleNode === null) {
      throw new Error('Cannot find a result anchor to click on');
    }
    const clickEvent = new CustomEvent('click');
    resultTitleNode.dispatchEvent(clickEvent);

    expect(resultClickedHandler).toHaveBeenCalledTimes(1);
    expect(resultClickedHandler.mock.calls[0][0].detail).toEqual(
      expectedResult
    );
  });
});
