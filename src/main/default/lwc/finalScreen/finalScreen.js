import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import email from '@salesforce/label/c.cookbook_Email';
import phone from '@salesforce/label/c.cookbook_Phone';
import via from '@salesforce/label/c.cookbook_Via';
import goBackToCommunity from '@salesforce/label/c.cookbook_GoBackToCommunity';
import seeYourRequest from '@salesforce/label/c.cookbook_SeeYourRequest';
import forgiveUsForTheDelay from '@salesforce/label/c.cookbook_ForgiveUsForTheDelay';
import confirmationMailIsOnTheWay from '@salesforce/label/c.cookbook_ConfirmationEmailOnTheWay';
import agentWillBeInTouch from '@salesforce/label/c.cookbook_AgentWillBeInTouch';
import requestSuccessfullySaved from '@salesforce/label/c.cookbook_RequestSuccessfullySaved';

export default class FinalScreen extends NavigationMixin(LightningElement) {
  labels = {
    email,
    phone,
    via,
    goBackToCommunity,
    seeYourRequest,
    forgiveUsForTheDelay,
    confirmationMailIsOnTheWay,
    agentWillBeInTouch,
    requestSuccessfullySaved
  };

  /**
   * The record ID of the newly created case.
   * @type {string}
   */
  @api recordId;
  /**
   * caseData is the variable that will be accessible as an output variable to the Flow.
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api
  get caseData() {
    return this._caseData;
  }

  connectedCallback() {
    this.caseRecordPageRef = {
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        objectApiName: 'Case',
        actionName: 'view'
      }
    };

    this.homePageRef = {
      type: 'standard__namedPage',
      attributes: {
        pageName: 'home'
      }
    };
    this[NavigationMixin.GenerateUrl](this.caseRecordPageRef).then(
      (url) => (this.url = url)
    );
  }

  handleSeeRequest() {
    this[NavigationMixin.Navigate](this.caseRecordPageRef);
  }

  handleGoBackToCommunity() {
    this[NavigationMixin.Navigate](this.homePageRef);
  }
}
