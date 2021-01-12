import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import generateAnalyticsToken from '@salesforce/apex/AnalyticsTokenGenerator.generateAnalyticsToken';
import CoveoUA from '@salesforce/resourceUrl/coveoua';

export default class AnalyticsBeacon extends LightningElement {
  static initializationPromise;

  constructor() {
    super();
    if (AnalyticsBeacon.initializationPromise) {
      return;
    }
    AnalyticsBeacon.initializationPromise = Promise.all([
      loadScript(this, CoveoUA + '/coveoua.js'),
      generateAnalyticsToken()
    ]);
    this.initCoveoUA();
  }

  async initCoveoUA() {
    const [, token] = await AnalyticsBeacon.initializationPromise;
    if (window.coveoua) {
      window.coveoua('init', token);
    }
  }
}

export async function coveoua(...args) {
  if (AnalyticsBeacon.initializationPromise) {
    await AnalyticsBeacon.initializationPromise;
    return window.coveoua(...args);
  }
  throw new Error(
    'Analytics Beacon cannot be found, include the component in your page to send events.'
  );
}
