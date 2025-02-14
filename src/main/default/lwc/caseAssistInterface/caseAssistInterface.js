import getHeadlessConfiguration from '@salesforce/apex/HeadlessController.getHeadlessConfiguration';
import {
  getHeadlessBindings,
  loadDependencies,
  setEngineOptions,
  setInitializedCallback,
  HeadlessBundleNames
} from 'c/quanticHeadlessLoader';
import QuanticCaseAssistInterface from 'c/quanticCaseAssistInterface';

export default class CaseAssistInterface extends QuanticCaseAssistInterface {
  connectedCallback() {
    loadDependencies(this, HeadlessBundleNames.caseAssist).then(() => {
      if (!getHeadlessBindings(this.engineId)?.engine) {
        getHeadlessConfiguration().then((data) => {
          if (data) {
            this.engineOptions = {
              configuration: {
                ...JSON.parse(data),
                caseAssistId: this.caseAssistId,
                searchHub: this.searchHub,
                analytics: {
                  analyticsMode: 'legacy',
                  ...(document.referrer && {
                    originLevel3: document.referrer.substring(0, 256),
                  }),
                  analyticsClientMiddleware: (_event, payload) => {
                    if (!payload.customData) {
                      payload.customData = {};
                    }
                    payload.customData.coveoQuanticVersion =
                      window.coveoQuanticVersion;
                    return payload;
                  },
                },
              }
            };
            setEngineOptions(
              this.engineOptions,
              CoveoHeadlessCaseAssist.buildCaseAssistEngine,
              this.engineId,
              this,
              CoveoHeadlessCaseAssist
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
