public with sharing class RatingsHandler {
    @AuraEnabled(cacheable=false)
    public static List<Rating__c> getRating(String documentId) {
        return [
            SELECT Score__c, Document_id__c
            FROM Rating__c
            WHERE Document_id__c = :documentId
        ];
    }
}
