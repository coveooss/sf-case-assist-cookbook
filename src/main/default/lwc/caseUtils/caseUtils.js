import { createRecord } from 'lightning/uiRecordApi';

const CASE_OBJECT = 'Case';

export async function createCase(caseData) {
  try {
    const objRecordInput = { apiName: CASE_OBJECT, fields: caseData };
    const response = await createRecord(objRecordInput);
    return response.id;
  } catch (err) {
    throw err;
  }
}
