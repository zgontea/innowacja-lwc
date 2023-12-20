/**
 * Created by jgontarek on 20.12.2023.
 */

public with sharing class TagController {
    @AuraEnabled
    public static void saveTags(Id recordId, String tags) {
        update new Doctor__c(Id = recordId, Tags__c = tags);
    }
}