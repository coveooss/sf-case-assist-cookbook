/**
 * Enum for the supported analytics action names
 * @readonly
 * @enum {string}
 */
export const analyticsActionNames = Object.freeze({
  TICKET_CREATE_START: 'ticket_create_start',
  TICKET_CLASSIFICATION_CLICK: 'ticket_classification_click',
  TICKET_FIELD_UPDATE: 'ticket_field_update',
  TICKET_NEXT_STAGE: 'ticket_next_stage',
  TICKET_CREATE: 'ticket_create',
  TICKET_CANCEL: 'ticket_cancel',
  SUGGESTION_CLICK: 'suggestion_click',
  SUGGESTION_RATE: 'suggestion_rate'
});
