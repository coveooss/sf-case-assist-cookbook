# Upgrade Notes: Quantic 3.x

## Overview
This branch upgrades the cookbook from Quantic v2.25.0.0 to Quantic 3.x to restore advanced search features that are essential for the Search API-based Case Assist implementation.

## What Changed

### 1. Quantic Dependency Update
- **File**: `sfdx-project.json`
- **Change**: Updated dependency from `Quantic v2.25.0.0` to `Quantic v3.x`
- **Action Required**: The package alias is already configured. Verify that the Quantic 3.x package is installed in your Salesforce org using the [Quantic installation documentation](https://docs.coveo.com/en/quantic/latest/usage/#install-quantic). Update the package version ID in `sfdx-project.json` if you need a specific Quantic 3.x version.

### 2. Restored Advanced Search Components
- **File**: `src/main/default/lwc/caseAssistSearch/caseAssistSearch.html`
- **Components Restored**:
  - `c-quantic-generated-answer`: Enables Generative AI-powered answers
  - `c-quantic-notifications`: Provides query pipeline notifications (renamed from `quantic-triggers` in Quantic 3.x)
  - `c-quantic-smart-snippet-suggestions`: Enhanced smart snippet suggestions (already present)

### 3. Documentation Updates
- **File**: `README.md`
- **Change**: Added note about Quantic 3.x requirement and the advanced features it enables

## Component Availability by Version

| Component | Quantic 2.x | Quantic 3.x |
|-----------|-------------|-------------|
| `quantic-generated-answer` | ❌ Not available | ✅ Available |
| `quantic-smart-snippet-suggestions` | ✅ Available | ✅ Available |
| `quantic-notifications` (formerly `quantic-triggers`) | ⚠️ Limited | ✅ Available |
| `quantic-result-list` | ✅ Available | ✅ Available |

## Testing Checklist

After deploying this upgrade, verify:

- [ ] Quantic 3.x package is installed in your Salesforce org
- [ ] Demo Flow loads and displays search results
- [ ] Recommended Flow loads and displays search results
- [ ] Generative Answer component displays (if configured)
- [ ] Smart Snippets display correctly
- [ ] Query Notifications work as expected
- [ ] Voting/rating functionality still works
- [ ] No console errors in browser developer tools

## Breaking Changes

Review the [Quantic changelog](https://docs.coveo.com/en/quantic/latest/change-log/) for any breaking changes between v2.25 and v3.x that might affect your customizations.

## Rollback

If you need to rollback to Quantic 2.x:
1. Revert changes to `sfdx-project.json`
2. Remove `c-quantic-generated-answer` and `c-quantic-notifications` from `caseAssistSearch.html`
3. Deploy the reverted changes

## Additional Resources

- [Quantic Documentation](https://docs.coveo.com/en/quantic/latest/)
- [Quantic Installation Guide](https://docs.coveo.com/en/quantic/latest/usage/#install-quantic)
- [Quantic Changelog](https://docs.coveo.com/en/quantic/latest/change-log/)
- [Quantic Search Components Reference](https://docs.coveo.com/en/quantic/latest/reference/search-components/)
