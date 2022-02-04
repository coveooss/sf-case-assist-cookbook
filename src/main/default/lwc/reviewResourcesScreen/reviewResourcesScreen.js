import { LightningElement, api } from 'lwc';
import {
  FlowNavigationNextEvent,
  FlowNavigationBackEvent
} from 'lightning/flowSupport';
import previous from '@salesforce/label/c.cookbook_Previous';
import theseResourcesMightHelp from '@salesforce/label/c.cookbook_TheseResourcesMightHelp';
import resourcesSuggested from '@salesforce/label/c.cookbook_ResourcesSuggested';
import stillNeedHelp from '@salesforce/label/c.cookbook_StillNeedHelp';
import changedYourMind from '@salesforce/label/c.cookbook_ChangedYourMind';
import sendYourRequest from '@salesforce/label/c.cookbook_SendYourRequest';
import weHaveTheInformationWeNeed from '@salesforce/label/c.cookbook_WeHaveTheInformationWeNeed';

export default class reviewResourcesScreen extends LightningElement {
  labels = {
    previous,
    theseResourcesMightHelp,
    resourcesSuggested,
    stillNeedHelp,
    changedYourMind,
    weHaveTheInformationWeNeed,
    sendYourRequest
  };
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
  /**
   * The record id of the new created case.
   *  @type {boolean}
   */
  @api recordId;

  /** @type {Array<string>} */
  slotsToBeHidden = [];
  /** @type {boolean} */
  hasSuggestions = true;

  connectedCallback() {
    this.template.addEventListener('rating', this.onRating);
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
  };

  onShowActionSlot = (evt) => {
    const actionSlot = this.getSlotById('c-vote-tracker-wrapper', evt.detail);
    if (actionSlot) {
      actionSlot.show();
    }
  };

  onNoSuggestions = () => {
    this.hasSuggestions = false;
  };

  onSuggestions = () => {
    this.hasSuggestions = true;
  };

  getSlotById(tag, id) {
    const actionsSlots = this.template.querySelectorAll(tag);
    return actionsSlots.find((slot) => slot.dataset.id === id);
  }

  get reviewResourcesTitle() {
    return this.hasSuggestions
      ? this.labels.theseResourcesMightHelp
      : this.sendYourRequest;
  }

  get reviewResourcesSubtitle() {
    return this.hasSuggestions
      ? this.labels.resourcesSuggested
      : this.labels.weHaveTheInformationWeNeed;
  }

  get abandonRequestLabel() {
    return this.hasSuggestions ? 'Solved your problem?' : 'Changed your mind?';
  }
}
