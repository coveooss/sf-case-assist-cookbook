export function debounce(fn, wait) {
  let timeout;
  return function () {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, wait); // eslint-disable-line @lwc/lwc/no-async-operation
  };
}

export function getVisitorId() {
  let visitorId;
  try {
    if (window.coveoanalytics) {
      // If you have the AnalyticsBeacon LWC in your community, it will have generated a visitorId for you by now.
      visitorId = window.coveoanalytics.storage
        .getAvailableStorage()
        .getItem('visitorId');
    }

    if (!visitorId) {
      visitorId = localStorage.getItem('visitorId');
    }
    if (!visitorId) console.warn('Cannot find visitorId from the community');
  } catch (err) {
    console.warn('Cannot find visitorId from the community');
  }

  return visitorId;
}
