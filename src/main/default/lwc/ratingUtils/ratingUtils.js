import getRating from '@salesforce/apex/RatingsHandler.getRating';
import { createRecord, updateRecord } from 'lightning/uiRecordApi';

const RATING_OBJECT = 'Rating__c';
const SCORE_FIELD = 'Score__c';
const DOCUMENT_ID_FIELD = 'Document_id__c';

/**
 * Async method to increment the score rating of a given document.
 * @param {String} id The id of the document with the rating to be incremented.
 *
 * @return void
 */
export async function incrementScore(id) {
  try {
    const response = await getRating({ documentId: id });
    if (response && response.length > 0) {
      this.object = response[0];
      this.object[SCORE_FIELD]++;
      await updateRecord({ fields: { ...this.object } });
    }
  } catch (err) {
    console.warn('Failed to increment rating score');
    throw err;
  }
}

/**
 * Async method to get the rating score of a given document.
 * @param {String} id The id of the document with the rating to get.
 *
 * @return void
 */
export async function getScore(id) {
  try {
    const response = await getRating({ documentId: id });
    if (!response || !response?.length) {
      const fields = {
        [SCORE_FIELD]: 0,
        [DOCUMENT_ID_FIELD]: id
      };
      const objRecordInput = { apiName: RATING_OBJECT, fields };
      await createRecord(objRecordInput);
      return 0;
    }
    return response[0][SCORE_FIELD];
  } catch (err) {
    console.warn('Failed to get rating score');
    throw err;
  }
}
