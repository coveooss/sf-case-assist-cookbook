import { createRecord } from 'lightning/uiRecordApi';

const CASE_OBJECT = 'Case';

export async function createCase(caseData) {
  try {
    const fields = {
      Subject: caseData.subject,
      Description: caseData.description,
      Reason: caseData.reason,
      Priority: caseData.priority,
      Type: caseData.type
    };
    const objRecordInput = { apiName: CASE_OBJECT, fields };
    const response = await createRecord(objRecordInput);
    return response.id;
  } catch (err) {
    throw err;
  }
}
