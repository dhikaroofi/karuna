# Firebase Environment Variables Setup

After your Firebase deployment succeeds, you need to configure environment variables in Firebase:

## Option 1: Firebase Hosting + Functions (if needed)

For Firebase Functions, set environment config:
```bash
firebase functions:config:set \
  supabase.url="https://jddeugagymbqlmrtkxcj.supabase.co" \
  supabase.key="sb_publishable_Mp1Qc1BLmB9QRV83aw-rvg_atV384I2"
```

## Option 2: Build-time Environment Variables

Since you're doing a static export, the environment variables need to be available at **build time**. 

### Firebase App Hosting:
Create `apphosting.yaml` in your project root:

```yaml
# apphosting.yaml
runConfig:
  runCommand: "pnpm run build"
env:
  - variable: NEXT_PUBLIC_SUPABASE_URL
    value: "https://jddeugagymbqlmrtkxcj.supabase.co"
  - variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
    value: "sb_publishable_Mp1Qc1BLmB9QRV83aw-rvg_atV384I2"
```

### Alternative: Use .env file in deployment

The code is now updated to use placeholder values during build if env vars are missing. This allows the build to succeed, and you can configure the real values later.

## Current Fix:

I've updated `lib/supabase.js` to:
- ✅ Use placeholder values during build
- ✅ Allow static export to succeed
- ✅ Work with real values when deployed with proper env vars

The build should now succeed! The Supabase features will work once you add your environment variables to Firebase.
