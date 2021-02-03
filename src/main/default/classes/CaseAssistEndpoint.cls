public with sharing class CaseAssistEndpoint {
    // This is the ID of the configuration of the case assist to use.
    // @see https://docs.coveo.com/en/3315/coveo-for-salesforce/consuming-the-case-assist-api-using-apex#retrieving-your-case-assist-configuration-id
    // To keep this example simple, the Case Assist ID is stored as a constant. However, in your implementation, you should store it in Salesforce for example using a custom Metadata.
    // https://help.salesforce.com/articleView?id=custommetadatatypes_overview.htm&type=5
    public static final String CASE_ASSIST_ID = 'YOUR_CASE_ASSIST_ID';

    /**
     * Retrieve case fields suggestions from Case Assist.
     * @see https://docs.coveo.com/en/3325/coveo-for-salesforce/retrieving-case-classifications-using-apex
     *
     * @param {String} subject The subject of the current case being created.
     * @param {String} description The description of the current case being created.
     * @param {String} visitorId The visitorId to link the analytics from CaseAssist to the rest of the community visit.
     * @see https://docs.coveo.com/en/3320/analyze-usage-data/visitor-id-and-visit-id-dimensions
     */
    @AuraEnabled
    public static String getCaseClassifications(
        String subject,
        String description,
        String visitorId
    ) {
        try {
            Map<String, Object> fieldsMap = new Map<String, Object>();
            CaseAssistEndpoint.addToMapIfNotNull(fieldsMap, subject, 'subject');
            CaseAssistEndpoint.addToMapIfNotNull(
                fieldsMap,
                description,
                'description'
            );
            if (fieldsMap.isEmpty()) {
                throw new AuraHandledException(
                    'Should not get case classifications without at least a subject or description'
                );
            }
            Map<String, Object> classifications = CaseAssistEndpoint.getCaseAssistClient()
                .getCaseClassifications(
                    new Map<String, Object>{
                        'visitorId' => visitorId,
                        'fields' => fieldsMap
                    }
                );
            return JSON.serialize(classifications);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * Retrieve document suggestions from Case Assist.
     * @see https://docs.coveo.com/en/3317/coveo-for-salesforce/retrieving-document-suggestions-using-apex
     *
     * @param {String} subject The subject of the current case being created.
     * @param {String} description The description of the current case being created.
     * @param {String} visitorId The visitorId to link the analytics from CaseAssist to the rest of the community visit.
     * @see https://docs.coveo.com/en/3320/analyze-usage-data/visitor-id-and-visit-id-dimensions
     */
    @AuraEnabled
    public static String getDocumentSuggestions(
        String subject,
        String description,
        String visitorId
    ) {
        try {
            Map<String, Object> fieldsMap = new Map<String, Object>();
            CaseAssistEndpoint.addToMapIfNotNull(fieldsMap, subject, 'subject');
            CaseAssistEndpoint.addToMapIfNotNull(
                fieldsMap,
                description,
                'description'
            );
            if (fieldsMap.isEmpty()) {
                throw new AuraHandledException(
                    'Should not get case classifications without at least a subject or description'
                );
            }
            Map<String, Object> result = CaseAssistEndpoint.getCaseAssistClient()
                .getDocumentSuggestions(
                    new Map<String, Object>{
                        'visitorId' => visitorId,
                        'fields' => fieldsMap
                    }
                );
            return JSON.serialize((List<Object>) result.get('documents'));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static CoveoV2.CaseAssistApiClient getCaseAssistClient() {
        return CoveoV2.CaseAssistApiClient.getClient(CASE_ASSIST_ID);
    }

    private static void addToMapIfNotNull(
        Map<String, Object> addTo,
        String toAdd,
        String mapKey
    ) {
        if (toAdd != null) {
            addTo.put(mapKey, new Map<String, Object>{ 'value' => toAdd });
        }
    }
}
