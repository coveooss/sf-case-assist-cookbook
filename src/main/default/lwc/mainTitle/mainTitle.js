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
   */
  @api title = this.labels.mainTitle;

  /**
   * The text value of the subtitle.
   * @type {string|undefined}
   */
  @api subtitle;

  /**
   * Indicates whether there is a subtitle to show.
   * @returns {boolean}
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }
}
