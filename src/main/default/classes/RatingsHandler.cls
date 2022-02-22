public with sharing class RatingsHandler {
    @AuraEnabled(cacheable=false)
    public static Rating__c getRating(String documentId) {
        List<Rating__c> records = [
            SELECT Score__c, Document_id__c
            FROM Rating__c
            WHERE Document_id__c = :documentId
            LIMIT 1
        ];
        if (records.size() > 0) {
            return records[0];
        }
        return null;
    }
}
