import { LightningElement, api } from 'lwc';
import helpedUsers from '@salesforce/label/c.cookbook_HelpedUsers';
import helpedUsers_plural from '@salesforce/label/c.cookbook_HelpedUsers_plural';
import helpedUsers_zero from '@salesforce/label/c.cookbook_HelpedUsers_zero';
import { I18nUtils } from 'c/quanticUtils';

/**
 * The `voteCount` component is an indicator of how many people reported that a document was helpful.
 * @example
 * <c-vote-count active="true" count="102"></c-vote-count>
 */
export default class VoteCount extends LightningElement {
  labels = {
    helpedUsers,
    helpedUsers_plural,
    helpedUsers_zero
  };

  /**
   * The count to be shown to the user.
   * @type {number}
   * @defaultValue `0`
   */
  @api count = 0;

  /**
   * Tells if the component is active, the active state means the component will be colored in green.
   * @type {boolean}
   * @defaultValue `false`
   */
  @api active = false;

  /**
   * The alternative text to be assigned to the button icon.
   * @type {string}
   */
  @api altText;

  /**
   * Returns the label to show with the count value.
   * @returns {string}
   */
  get label() {
    const labelName = I18nUtils.getLabelNameWithCount(
      'helpedUsers',
      parseInt(this.count, 10)
    );
    return I18nUtils.format(this.labels[labelName], this.count);
  }

  /**
   * Returns the variant of the icon.
   * @returns {string}
   */
  get variant() {
    return this.active ? 'success' : '';
  }

  /**
   * Returns the css class of the label.
   * @returns {string}
   */
  get labelClass() {
    return this.active
      ? 'view-count_label slds-text-color_success'
      : 'view-count_label view-count_label-neutral';
  }
}
