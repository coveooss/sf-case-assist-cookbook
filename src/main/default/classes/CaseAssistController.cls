public with sharing class CaseAssistController {
    // This is a sample method that returns a headless configuration to target a sample organization.
    // You should replace this with the method commented below after linking your Salesforce Organization to a Coveo Organization.
    @AuraEnabled
    public static String getHeadlessConfiguration() {
        Map<String, String> headlessConfiguration = new Map<String, String>();
        headlessConfiguration.put('organizationId', 'searchuisamples');
        headlessConfiguration.put(
            'accessToken',
            'xx564559b1-0045-48e1-953c-3addd1ee4457'
        );
        headlessConfiguration.put(
            'platformUrl',
            'https://platform.cloud.coveo.com'
        );
        return JSON.serialize(headlessConfiguration);
    }

    /**
     * Calls the Coveo for Salesforce package to retrieve information about the linked organization and to get a search token.
     * Note: To use the CoveoCaseAssistTokenProvider class, Coveo for Salesforce must be installed and configured in your environment.
     * For more information, @see https://docs.coveo.com/en/1158/coveo-for-salesforce/getting-started-with-coveo-for-salesforce.
     */
    // @AuraEnabled
    // public static String getHeadlessConfiguration() {
    //     Map<String, Object> platformTokenParams = new Map<String, Object>();

    //     // The platform token needs to request the required privileges to use Case Assist.
    //     List<CoveoV2.PlatformToken.TokenPrivilege> privileges = new List<CoveoV2.PlatformToken.TokenPrivilege>();
    //     // Adding the required privilege to use Case Assist.
    //     privileges.add(
    //         new CoveoV2.PlatformToken.TokenPrivilege(
    //             'CUSTOMER_SERVICE',
    //             'USE_CASE_ASSIST',
    //             'ENABLE'
    //         )
    //     );
    //     // Adding the required privilege to log analytics.
    //     privileges.add(
    //         new CoveoV2.PlatformToken.TokenPrivilege(
    //             'USAGE_ANALYTICS',
    //             'ANALYTICS_DATA',
    //             'EDIT'
    //         )
    //     );
    //     platformTokenParams.put('privileges', privileges);

    //     // Generate the platform token by calling the Coveo platform.
    //     String platformToken = CoveoV2.Globals.generatePlatformToken(
    //         platformTokenParams
    //     );

    //     // Add additional required information to create the Case Assist Endpoint.
    //     Map<String, Object> headlessEndpointData = CoveoV2.Globals.getEndpointData();
    //     Map<String, String> headlessConfiguration = new Map<String, String>();
    //     headlessConfiguration.put('accessToken', platformToken);
    //     headlessConfiguration.put(
    //         'organizationId',
    //         (String) headlessEndpointData.get('organization')
    //     );
    //     headlessConfiguration.put(
    //         'platformUrl',
    //         (String) headlessEndpointData.get('clientUri')
    //     );
    //     return JSON.serialize(headlessConfiguration);
    // }
}
