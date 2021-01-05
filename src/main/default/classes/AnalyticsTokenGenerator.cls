public with sharing class AnalyticsTokenGenerator {
    @AuraEnabled(cacheable=true)
    public static string generateAnalyticsToken() {
        try {
            return CoveoV2.Globals.generateSearchToken();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
