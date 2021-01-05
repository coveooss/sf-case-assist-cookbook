@isTest
private class CaseAssistEndpointTest {
    @isTest
    static void testCaseAssistGetClassifications() {
        AuraHandledException ex;
        try {
            String result = CaseAssistEndpoint.getCaseClassifications(
                'foo',
                'bar',
                'baz'
            );
        } catch (AuraHandledException e) {
            ex = e;
        }
        System.assertNotEquals(
            null,
            ex,
            'Method should throw an exception in a test.'
        );
    }

    @isTest
    static void testCaseAssistGetDocumentSuggestions() {
        AuraHandledException ex;
        try {
            String result = CaseAssistEndpoint.getDocumentSuggestions(
                'foo',
                'bar',
                'baz'
            );
        } catch (AuraHandledException e) {
            ex = e;
        }
        System.assertNotEquals(
            null,
            ex,
            'Method should throw an exception in a test.'
        );
    }
}
