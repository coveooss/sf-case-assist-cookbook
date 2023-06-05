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
import solvedYourProblem from '@salesforce/label/c.cookbook_SolvedProblem';
import sendYourRequest from '@salesforce/label/c.cookbook_SendYourRequest';
import weHaveTheInformationWeNeed from '@salesforce/label/c.cookbook_WeHaveTheInformationWeNeed';
import describeProblem from '@salesforce/label/c.cookbook_DescribeProblem';
import provideDetails from '@salesforce/label/c.cookbook_ProvideDetails';
import reviewResources from '@salesforce/label/c.cookbook_ReviewResources';

export default class reviewResourcesScreen extends LightningElement {
  labels = {
    previous,
    theseResourcesMightHelp,
    resourcesSuggested,
    stillNeedHelp,
    changedYourMind,
    weHaveTheInformationWeNeed,
    sendYourRequest,
    solvedYourProblem,
    describeProblem,
    provideDetails,
    reviewResources
  };
  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;
  /**
   * availableActions is an array that contains the available flow actions when this component is used within a flow
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];
  /**
   * A JSON-serialized object representing the current case fields.
   * @type {string}
   */
  @api caseData;
  /**
   * The record id of the new created case.
   *  @type {boolean}
   */
  @api recordId;
  /**
   * The type of the flow where this screen is used.
   * @type {'recommended_flow' | 'demo_flow'}
   */
  @api flowType;

  /** @type {Array<string>} */
  slotsToBeHidden = [];
  /** @type {boolean} */
  hasSuggestions = true;
  /** @type{object} */
  _caseData;
  /** @type {array} */
  idsPreviouslyVoted = [];
  /** @type {array} */
  idsPreviouslyVotedPositive = [];

  connectedCallback() {
    this.template.addEventListener('rating', this.onRating);
    this.template.addEventListener('show_action_slot', this.onShowActionSlot);
    this.template.addEventListener('no_suggestions', this.onNoSuggestions);
    this.template.addEventListener('next', this.handleNext);
    try {
      if (this.caseData) {
        this._caseData = JSON.parse(this.caseData);
      }
    } catch (err) {
      console.warn('Failed to parse the flow variable caseData', err);
      this._caseData = {};
    }
  }

  canMoveNext() {
    return this.availableActions.some((action) => action === 'NEXT');
  }

  canMovePrevious() {
    return this.availableActions.some((action) => action === 'BACK');
  }

  handleNext = () => {
    if (this.canMoveNext()) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  };

  handlePrevious() {
    if (this.canMovePrevious()) {
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
      this.persistIdsPreviouslyVoted();
      this.persistIdsPreviouslyVotedPositive();
    }
  }

  persistIdsPreviouslyVotedPositive() {
    if (sessionStorage.idsPreviouslyVotedPositive) {
      try {
        this.idsPreviouslyVotedPositive = [
          ...JSON.parse(sessionStorage.idsPreviouslyVotedPositive),
          ...this.idsPreviouslyVotedPositive
        ];
      } catch (err) {
        console.warn(
          'Failed to parse the idsPreviouslyVotedPositive array',
          err
        );
      }
    }
    sessionStorage.idsPreviouslyVotedPositive = JSON.stringify(
      this.idsPreviouslyVotedPositive
    );
  }

  persistIdsPreviouslyVoted() {
    if (sessionStorage.idsPreviouslyVoted) {
      try {
        this.idsPreviouslyVoted = [
          ...JSON.parse(sessionStorage.idsPreviouslyVoted),
          ...this.idsPreviouslyVoted
        ];
      } catch (err) {
        console.warn('Failed to parse the idsPreviouslyVoted array', err);
      }
    }
    sessionStorage.idsPreviouslyVoted = JSON.stringify(this.idsPreviouslyVoted);
  }

  onRating = (evt) => {
    if (evt.detail.type === 'positive') {
      const countSlot = this.getSlotById('c-vote-count-wrapper', evt.detail.id);
      if (countSlot) {
        countSlot.incrementScore();
      }
      this.idsPreviouslyVotedPositive = [
        ...this.idsPreviouslyVotedPositive,
        evt.detail.id
      ];
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

    this.idsPreviouslyVoted = [...this.idsPreviouslyVoted, evt.detail.id];
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
    for (let i = 0; i < actionsSlots.length; i++) {
      if (actionsSlots[i].dataset.id === id) {
        return actionsSlots[i];
      }
    }
    return null;
  }

  get reviewResourcesTitle() {
    return this.hasSuggestions
      ? this.labels.theseResourcesMightHelp
      : this.labels.sendYourRequest;
  }

  get reviewResourcesSubtitle() {
    return this.hasSuggestions
      ? this.labels.resourcesSuggested
      : this.labels.weHaveTheInformationWeNeed;
  }

  get abandonRequestLabel() {
    return this.hasSuggestions
      ? this.labels.solvedYourProblem
      : this.labels.changedYourMind;
  }

  get abandonRequestClass() {
    return this.hasSuggestions ? 'slds-var-m-right_small' : '';
  }

  get steps() {
    if (this.flowType === 'demo_flow') {
      return [
        {
          label: this.labels.describeProblem,
          value: 'describe problem'
        },
        {
          label: this.labels.reviewResources,
          value: 'review resources'
        }
      ];
    }
    return [
      {
        label: this.labels.describeProblem,
        value: 'describe problem'
      },
      {
        label: this.labels.provideDetails,
        value: 'provide details'
      },
      {
        label: this.labels.reviewResources,
        value: 'review resources'
      }
    ];
  }
}
