import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';
import logIn from '@salesforce/label/c.cookbook_LogIn';
import describeProblem from '@salesforce/label/c.cookbook_DescribeProblem';
import provideDetails from '@salesforce/label/c.cookbook_ProvideDetails';
import reviewResources from '@salesforce/label/c.cookbook_ReviewResources';
import username from '@salesforce/label/c.cookbook_Username';
import password from '@salesforce/label/c.cookbook_Password';
import forgetYourPassword from '@salesforce/label/c.cookbook_ForgetYourPassword';
import rememberMe from '@salesforce/label/c.cookbook_RememberMe';
import getHelp from '@salesforce/label/c.cookbook_GetHelp';
import loginTitle from '@salesforce/label/c.cookbook_LoginTitle';
import loginSubtitle from '@salesforce/label/c.cookbook_LoginSubtitle';

/** @typedef {import("coveo").CaseAssistEngine} CaseAssistEngine */

export default class LoginScreen extends LightningElement {
  labels = {
    logIn,
    describeProblem,
    provideDetails,
    reviewResources,
    username,
    password,
    rememberMe,
    forgetYourPassword,
    getHelp,
    loginTitle,
    loginSubtitle
  };

  /**
   * availableActions is an array that contains the available flow actions when this component is used within a flow
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];

  value = [];
  get options() {
    return [{ label: this.labels.rememberMe, value: 'option1' }];
  }

  handleButtonNext() {
    if (this.availableActions.some((action) => action === 'NEXT')) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
      this.engine.dispatch(this.actions.logCaseNextStage());
    }
  }

  steps = [
    { label: this.labels.logIn, active: true },
    { label: this.labels.describeProblem, active: false },
    { label: this.labels.provideDetails, active: false },
    { label: this.labels.reviewResources, active: false }
  ];
}
