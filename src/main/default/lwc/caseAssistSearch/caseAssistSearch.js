import { LightningElement, api } from 'lwc';
import {
  getHeadlessBindings,
  loadDependencies,
  setEngineOptions,
  setInitializedCallback,
  HeadlessBundleNames
} from 'c/quanticHeadlessLoader';
import getHeadlessConfiguration from '@salesforce/apex/CaseAssistController.getHeadlessConfiguration';

/* global CoveoHeadless */

/**
 * The "caseAssistSearch" component provides a search-based Case Assist experience
 * using the Search API instead of the Document Suggestion API.
 * @example
 * <c-case-assist-search engine-id={engineId} search-hub={searchHub} case-data={caseData}></c-case-assist-search>
 */
export default class CaseAssistSearch extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  
  /**
   * The search hub to use for the search interface.
   * @type {string}
   */
  @api searchHub;
  
  /**
   * The pipeline to use for the search interface.
   * @type {string}
   */
  @api pipeline;
  
  /**
   * A JSON-serialized object representing the current case fields.
   * @type {string}
   */
  @api caseData;

  /** @type {boolean} */
  hasResults = true;
  /** @type {Array<string>} */
  slotsToBeHidden = [];
  /** @type {object} */
  engine;
  /** @type {object} */
  contextAction;
  /** @type {object} */
  searchActions;
  /** @type {object} */
  analyticsActions;
  /** @type {boolean} */
  initialized = false;
  /** @type {object} */
  _parsedCaseData;
  /** @type {function} */
  unsubscribeResultList;

  connectedCallback() {
    this.template.addEventListener('rating', this.onRating);
    this.template.addEventListener('show_action_slot', this.onShowActionSlot);
    
    try {
      if (this.caseData) {
        this._parsedCaseData = typeof this.caseData === 'string' 
          ? JSON.parse(this.caseData) 
          : this.caseData;
      }
    } catch (err) {
      console.warn('Failed to parse caseData', err);
      this._parsedCaseData = {};
    }

    this.loadSearchEngine();
  }

  disconnectedCallback() {
    if (this.unsubscribeResultList) {
      this.unsubscribeResultList();
    }
  }

  loadSearchEngine() {
    loadDependencies(this, HeadlessBundleNames.search).then(() => {
      if (!getHeadlessBindings(this.engineId)?.engine) {
        getHeadlessConfiguration().then((data) => {
          if (data) {
            const config = JSON.parse(data);
            this.engineOptions = {
              configuration: {
                ...config,
                searchHub: this.searchHub,
                pipeline: this.pipeline,
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

  initialize = (engine) => {
    if (this.initialized) {
      return;
    }

    this.engine = engine;
    this.contextAction = CoveoHeadless.loadContextActions(engine);
    this.searchActions = CoveoHeadless.loadSearchActions(engine);
    this.analyticsActions = CoveoHeadless.loadSearchAnalyticsActions(engine);

    // Subscribe to result list state to track if there are results
    const resultListController = CoveoHeadless.buildResultList(engine);
    this.unsubscribeResultList = resultListController.subscribe(() => {
      const state = resultListController.state;
      this.hasResults = state.results && state.results.length > 0;
      if (!this.hasResults) {
        this.dispatchEvent(
          new CustomEvent('no_suggestions', {
            bubbles: true,
            composed: true
          })
        );
      }
    });

    // Set case context from case data
    const caseContext = this.buildCaseContext();
    
    engine.dispatch(this.contextAction.setContext(caseContext));
    // Execute search with analytics tracking
    // The logInterfaceLoad() action is passed to track the interface load event
    engine.dispatch(
      this.searchActions.executeSearch(
        this.analyticsActions.logInterfaceLoad()
      )
    );

    this.initialized = true;
  };

  buildCaseContext() {
    const context = {};
    
    if (this._parsedCaseData) {
      // Add standard fields
      if (this._parsedCaseData.Subject) {
        context.subject = this._parsedCaseData.Subject;
      }
      if (this._parsedCaseData.Description) {
        context.description = this._parsedCaseData.Description;
      }
      
      // Add any custom fields from case data
      // Filter out null/undefined values and standard fields already added
      Object.keys(this._parsedCaseData).forEach((key) => {
        if (
          key !== 'Subject' && 
          key !== 'Description' && 
          this._parsedCaseData[key] != null
        ) {
          context[key] = this._parsedCaseData[key];
        }
      });
    }
    
    return context;
  }

  onRating = (evt) => {
    if (evt.detail.type === 'positive') {
      const countSlot = this.getSlotById('c-vote-count-wrapper', evt.detail.id);
      if (countSlot) {
        countSlot.incrementScore();
      }
    }
    
    if (evt.detail.source === 'quickview_footer') {
      const actionSlot = this.getSlotById(
        'c-vote-tracker-wrapper',
        evt.detail.id
      );
      if (actionSlot) {
        actionSlot.hide();
      }
    }

    this.slotsToBeHidden = [...this.slotsToBeHidden, evt.detail.id];
    
    // Bubble up the rating event for parent component
    this.dispatchEvent(
      new CustomEvent('rating', {
        detail: evt.detail,
        bubbles: true,
        composed: true
      })
    );
  };

  onShowActionSlot = (evt) => {
    const actionSlot = this.getSlotById('c-vote-tracker-wrapper', evt.detail);
    if (actionSlot) {
      actionSlot.show();
    }
  };

  getSlotById(tag, id) {
    const slots = this.template.querySelectorAll(tag);
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].dataset.id === id) {
        return slots[i];
      }
    }
    return null;
  }
}
