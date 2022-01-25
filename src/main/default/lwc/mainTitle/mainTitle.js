import { LightningElement, api } from 'lwc';
import mainTitle from '@salesforce/label/c.cookbook_MainTitle';

/**
 * The `mainTitle` component is a title to mark the beginning of a screen on the case assist flow.
 * @example
 * <c-main-title title="Explain the problem" subtitle="Detail your problem to find the agent best suited to help you"></c-main-title>
 */
export default class MainTitle extends LightningElement {
  labels = {
    mainTitle
  };

  /**
   * The text value of the title.
   * @type {string}
   * @defaultValue `'Hi, how may we help you?'`
   */
  @api title = this.labels.mainTitle;
  /**
   * The text value of the subtitle.
   * @type {string|undefined}
   */
  @api subtitle;
  /**
   * Tells whether or not we want to center the title.
   * @type {boolean}
   * @defaultValue `false`
   */
  @api alignCenter = false;

  /**
   * Indicates whether there is a subtitle to show.
   * @returns {boolean}
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }

  /**
   * Returns the CSS class of the title.
   * @returns {string}
   */
  get titleClass() {
    return `slds-text-heading_large h1_heading slds-var-p-bottom_x-small ${
      this.alignCenter ? 'slds-align_absolute-center' : ''
    }`;
  }

  /**
   * Returns the CSS class of the title.
   * @returns {string}
   */
  get subtitleClass() {
    return `slds-text-heading_small ${
      this.alignCenter ? 'slds-align_absolute-center' : ''
    }`;
  }
}
