@isTest
private class RatingsHandlerTest {
  @isTest
  static void testGetRatingWithExistingRecord() {
    Rating__c testRating = new Rating__c(
      Score__c = 90,
      Document_id__c = 'TestDocumentId'
    );
    insert testRating;

    Rating__c result = RatingsHandler.getRating('TestDocumentId');

    System.assertEquals(testRating.Id, result.Id, 'The Result Id received: ' + result.Id + ' was expected to be: ' + testRating.Id);
    System.assertEquals(testRating.Score__c, result.Score__c, 'The Result score received: ' + result.Score__c + ' was expected to be: 90');
    System.assertEquals(testRating.Document_id__c, result.Document_id__c, 'The Result document Id received: ' + result.Document_id__c + ' was expected to be: TestDocumentId');
  }

  @isTest
  static void testGetRatingWithNoRecord() {
    Rating__c testRating = RatingsHandler.getRating('NonExistentDocumentId');
    System.assertEquals(null, testRating, 'Test Rating received: ' + testRating + ' was expected to be null.');
  }
}