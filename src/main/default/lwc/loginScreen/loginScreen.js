import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class LoginScreen extends LightningElement {
  /**
   * availableActions is an array that contains the available flow actions when this component is used within a flow
   * @see https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation
   */
  @api availableActions = [];
  value = [];
  get options() {
    return [{ label: 'Remember me', value: 'option1' }];
  }

  handleButtonNext() {
    if (this.availableActions.some((action) => action === 'NEXT')) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }

  steps = [
    { label: 'Log in', active: true },
    { label: 'Describe the problem', active: false },
    { label: 'Provide details for the agent', active: false },
    { label: 'Review help resources', active: false }
  ];
}
