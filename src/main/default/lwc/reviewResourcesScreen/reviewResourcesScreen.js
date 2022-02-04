import { LightningElement, api } from 'lwc';
import {
  FlowNavigationNextEvent,
  FlowNavigationBackEvent
} from 'lightning/flowSupport';

export default class reviewResourcesScreen extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId = 'engine';
  /**
   * availableActions is an array that contains the available flow actions when this component is used within a flow
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];
  /**
   * A stringified object representing the current fields set on the case.
   * @type {string}
   */
  @api caseData;
  /** @type {boolean} */
  @api recordId;

  /** @type {Array<string>} */
  slotsToBeHidden = [];
  /** @type {boolean} */
  hasSuggestions = true;

  connectedCallback() {
    this.template.addEventListener('rating_saved', this.onRatingSaved);
    this.template.addEventListener('show_action_slot', this.onShowActionSlot);
    this.template.addEventListener('no_suggestions', this.onNoSuggestions);
    this.template.addEventListener('next', this.handleNext);
    try {
      this._caseData = JSON.parse(this.caseData);
    } catch (err) {
      this._caseData = {};
    }
  }

  handleNext = () => {
    if (this.availableActions.some((action) => action === 'NEXT')) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  };

  handleBack() {
    if (this.availableActions.some((action) => action === 'BACK')) {
      sessionStorage.previousNavigation = true;
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
    }
  }

  onRatingSaved = (evt) => {
    if (evt.detail.type === 'positive') {
      const countSlot = this.getSlotById('c-vote-count-wrapper', evt.detail.id);
      countSlot.incrementDlot();
    }
    if (evt.detail.source === 'quickview_footer') {
      const actionsSlot = this.getSlotById(
        'c-vote-tracker-wrapper',
        evt.detail.id
      );
      actionsSlot.hide();
    }

    this.slotsToBeHidden = [...this.slotsToBeHidden, evt.detail.id];
  };

  onShowActionSlot = (evt) => {
    const actionsSlot = this.getSlotById('c-vote-tracker-wrapper', evt.detail);
    actionsSlot.show();
  };

  onNoSuggestions = () => {
    this.hasSuggestions = false;
  };

  onSuggestions = () => {
    this.hasSuggestions = true;
  };

  getSlotById(tag, id) {
    const actionsSlots = this.template.querySelectorAll(tag);
    for (let i = 0; i < actionsSlots.length; i++) {
      if (actionsSlots[i].dataset.id === id) {
        return actionsSlots[i];
      }
    }
    return null;
  }

  get reviewResourcesTitle() {
    return this.hasSuggestions
      ? 'These resources might help'
      : 'Send your request';
  }

  get reviewResourcesSubtitle() {
    return this.hasSuggestions
      ? 'Resources suggested based on your problem description'
      : 'Thank you, we have the information we need.';
  }

  get abandonRequestLabel() {
    return this.hasSuggestions ? 'Solved your problem?' : 'Changed your mind?';
  }
}
