import getHeadlessConfiguration from '@salesforce/apex/CaseAssistController.getHeadlessConfiguration';
import {
  getHeadlessBindings,
  loadDependencies,
  setEngineOptions,
  setInitializedCallback,
  HeadlessBundleNames
} from 'c/quanticHeadlessLoader';
import QuanticSearchInterface from 'c/quanticSearchInterface';

/* global CoveoHeadless */

/**
 * The `searchInterface` component extends `QuanticSearchInterface` to provide
 * custom configuration loading from Apex, similar to `caseAssistInterface`.
 * This allows the search engine to use the same Coveo organization configuration.
 */
export default class SearchInterface extends QuanticSearchInterface {
  connectedCallback() {
    loadDependencies(this, HeadlessBundleNames.search).then(() => {
      if (!getHeadlessBindings(this.engineId)?.engine) {
        getHeadlessConfiguration().then((data) => {
          if (data) {
            const config = JSON.parse(data);
            this.engineOptions = {
              configuration: {
                ...config,
                search: {
                  searchHub: this.searchHub,
                  ...(this.pipeline && { pipeline: this.pipeline })
                },
                analytics: {
                  analyticsMode: 'legacy',
                  ...(document.referrer && {
                    originLevel3: document.referrer.substring(0, 256)
                  }),
                  analyticsClientMiddleware: (_event, payload) => {
                    if (!payload.customData) {
                      payload.customData = {};
                    }
                    payload.customData.coveoQuanticVersion =
                      window.coveoQuanticVersion;
                    return payload;
                  }
                }
              }
            };
            setEngineOptions(
              this.engineOptions,
              CoveoHeadless.buildSearchEngine,
              this.engineId,
              this,
              CoveoHeadless
            );
            setInitializedCallback(this.initialize, this.engineId);
          }
        });
      } else {
        setInitializedCallback(this.initialize, this.engineId);
      }
    });
  }
}
