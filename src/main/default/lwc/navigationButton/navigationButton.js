import { LightningElement, api } from 'lwc';
import navigate from '@salesforce/label/c.cookbook_Navigate';

/**
 * The `navigationButton` is a button to navigate through the steps of the case creation process.
 * @example
 * <c-navigation-button type="next" show-icon label="Next"></navigation-button>
 */
export default class NavigationButton extends LightningElement {
  labels = {
    navigate
  };

  /**
   * The type of the navigation button.
   * @type {'next'|'previous'}
   * @defaultValue `'next'`
   */
  @api type = 'next';

  /**
   * The label to be shown in the button.
   * @type {string}
   * @defaultValue `'Navigate'`
   */
  @api label = this.labels.navigate;

  /**
   * Tells if an icon should be displayed with the button.
   * @type {boolean}
   * @defaultValue `false`
   *
   */
  @api showIcon = false;

  /**
   * Returns the variant of the button.
   * @returns {string}
   */
  get variant() {
    return this.type === 'next' ? 'brand' : 'base';
  }

  /**
   * Returns the name of the icon to be displayed.
   * @returns {string}
   */
  get iconName() {
    if (!this.showIcon) {
      return '';
    }
    return this.type === 'next'
      ? 'utility:chevronright'
      : 'utility:chevronleft';
  }

  /**
   * Returns the position where the icon will be displayed.
   * @returns {'right'|'left'}
   */
  get iconPosition() {
    return this.type === 'next' ? 'right' : 'left';
  }

  /**
   * Handles clicks on the navigation button.
   * @returns {void}
   */
  handleNavigate() {
    if (this.type === 'next') {
      this.dispatchEvent(new CustomEvent('next'));
    } else {
      this.dispatchEvent(new CustomEvent('previous'));
    }
  }
}
