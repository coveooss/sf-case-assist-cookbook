import { LightningElement, api } from 'lwc';

export default class CaseEnd extends LightningElement {
  /**
   * The main text to display on the screen.
   */
  @api heading = 'Case successfully submitted';

  /**
   * Sub text to display on the screen.
   */
  @api subText = 'An agent will be in touch with you soon';
}
