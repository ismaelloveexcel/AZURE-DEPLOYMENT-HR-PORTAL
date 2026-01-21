# “My Agent” — Deployment Guidance

This agent provides deployment guardrails for the custom “my agent” (distinct from the Azure Deployment Engineer).

## Purpose
- Keep “my agent” aligned with the repository’s Azure OIDC deployment pattern
- Prevent the known federated token failure from missing permissions or deprecated inputs

## Deployment Rules
1. **OIDC permissions are required**  
   ```yaml
   permissions:
     id-token: write
     contents: read
   ```
2. **Do not pass a client secret to `azure/login@v2`**  
   Only set `client-id`, `tenant-id`, and `subscription-id`.
3. **Secrets that must exist in GitHub**  
   `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `DATABASE_URL`, `AUTH_SECRET_KEY`.
4. **Use the existing workflow**  
   Trigger “Deploy to Azure” after secrets are set; then verify `/api/health` and `/api/health/db`.

## References
- OIDC token failure context: `REVIEW_SUMMARY.md`
- Deployment process: `.github/workflows/deploy.yml`
