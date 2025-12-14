# Quick Reference: Supabase Integration

## ✅ What's Been Done

- Installed `@supabase/supabase-js`
- Created Supabase client in `lib/supabase.js`
- Updated wishes form to save/load from database
- Updated RSVP form to save to database  
- Added loading states and error handling
- Created database schema SQL

## 🚀 Next Steps

1. **Create Supabase project** at https://supabase.com
2. **Get credentials** from Project Settings → API
3. **Create `.env.local`** file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```
4. **Run SQL schema** in Supabase SQL Editor (use `supabase-schema.sql`)
5. **Restart dev server**: `pnpm run dev`

📖 **Full guide**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 📁 Files Changed

- `app/page.jsx` - Added Supabase integration
- `lib/supabase.js` - Supabase client config
- `supabase-schema.sql` - Database schema
- `.env.local.example` - Environment template
