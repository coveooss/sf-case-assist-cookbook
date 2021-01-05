import getCaseClassifications from '@salesforce/apex/CaseAssistEndpoint.getCaseClassifications';
import getDocumentSuggestions from '@salesforce/apex/CaseAssistEndpoint.getDocumentSuggestions';

/**
 * And endpoint to request data from the different CaseAssist backend classes.
 * Use fetchCaseClassifications to predict field values for the different Case fields.
 * Use fetchDocSuggestions to get document recommendations for the case data.
 */
export default class CaseAssistEndpoint {
  /**
   * An object representing a CaseClassification predictions
   * @typedef {Object} Prediction
   * @property {Number} confidence A number between 0 and 1 representing the confidence of the prediction
   * @property {String} value The predicted value
   */

  /**
   * An object representing the CaseClassifications predictions response
   * @typedef {Object} PredictionResponse
   * @property {Prediction[]} predictions And array of predicted values for a field.
   */

  /**
   * Async method to call an Apex class to obtain Case Fields Suggestion values.
   * @param {String} subject The subject of the case being created
   * @param {String} description The description of the case being created.
   * @param {String} visitorId The visitorId to link the visit together for analytics reporting.
   *
   * @return {PredictionResponse} caseClassificationData An object representing the predictions.
   */
  async fetchCaseClassifications(subject, description, visitorId) {
    try {
      const caseClassificationData = await getCaseClassifications({
        subject: subject,
        description: description,
        visitorId: visitorId
      });
      return JSON.parse(caseClassificationData);
    } catch (err) {
      if (err.status) {
        const errorFromApi = JSON.parse(err.body.message);
        throw new Error(
          `{${errorFromApi.statusCode}} => ${errorFromApi.message}`
        );
      }
      throw err;
    }
  }

  /**
   * An object representing the suggested results
   * @typedef {String} Document An object representing a result
   * @param {String} clickUri The click uri for the result.
   * @param {String} excerpt  The excerpt of the result.
   * @param {Boolean} hasHtmlVersion A flag to say if the document has a Quickview.
   * @param {String} title The title of the document.
   * @param {String} uniqueId The uniqueId of the document. Used to display the Quickview.
   * @param {Object} fields The other fields for this result based on Coveo mapping.
   */

  /**
   * Async method to call an Apex class to obtain Document Suggestions.
   * @param {String} subject The subject of the case being created
   * @param {String} description The description of the case being created.
   * @param {String} visitorId The visitorId to link the visit together for analytics reporting.
   *
   * @return {Document[]} docSuggestionsData An array of documents returned as suggestions.
   */
  async fetchDocSuggestions(subject, description, visitorId) {
    try {
      const docSuggestionsData = await getDocumentSuggestions({
        subject: subject,
        description: description,
        visitorId: visitorId
      });
      return JSON.parse(docSuggestionsData);
    } catch (err) {
      if (err.status) {
        const errorFromApi = JSON.parse(err.body.message);
        throw new Error(
          `{${errorFromApi.statusCode}} => ${errorFromApi.message}`
        );
      }
      throw err;
    }
  }
}
