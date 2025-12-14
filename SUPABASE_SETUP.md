# Supabase Setup Guide

Follow these steps to complete the Supabase integration for your wedding website.

## 1. Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in the details:
   - **Project name**: `wedding-nova-hasan` (or your preferred name)
   - **Database password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose the closest to your location
4. Click "Create new project" and wait for setup to complete (~2 minutes)

## 2. Get Your Credentials

After project creation:

1. Go to **Project Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## 3. Configure Environment Variables

1. Create a file named `.env.local` in your project root
2. Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace the values with your actual credentials from step 2

> **Note**: Never commit `.env.local` to git. It's already in `.gitignore`

## 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click "New query"
3. Copy and paste the content from `supabase-schema.sql` file
4. Click "Run" or press Cmd/Ctrl + Enter
5. You should see "Success. No rows returned" message

## 5. Verify Setup

1. Restart your development server:
   ```bash
   # Stop the current server (Ctrl+C)
   pnpm run dev
   ```

2. Visit your website at `http://localhost:3000`
3. Test the wishes form:
   - Fill in name and message
   - Click "Kirim Ucapan"
   - It should appear in the list below
4. Go to Supabase dashboard → **Table Editor** → `wishes` table
   - You should see your wish there!

## 6. Test RSVP Form

1. Scroll to the RSVP section
2. Fill in name and status
3. Click "Kirim"
4. Check Supabase dashboard → **Table Editor** → `rsvps` table
5. Your RSVP should be saved

## Troubleshooting

### "Missing Supabase environment variables" error

- Make sure `.env.local` exists in the project root
- Check that variable names match exactly
- Restart the dev server after creating `.env.local`

### Data not saving

- Check browser console for errors (F12)
- Verify RLS policies were created (see SQL editor)
- Make sure you ran the entire schema SQL

### Wishes not loading

- Check Supabase dashboard → Authentication → Policies
- Ensure "Anyone can view wishes" policy exists
- Try adding a wish directly in Supabase Table Editor

## Next Steps

Once everything works:

1. **Add more wishes** manually in Supabase to test the list
2. **Deploy your website** (Vercel/Netlify)
3. Remember to add environment variables to your deployment platform
4. Share the website with guests!

## Security Note

The current setup allows anyone to:
- ✅ Submit wishes (and view them)
- ✅ Submit RSVPs (but NOT view others' RSVPs)

To view RSVP data, use the Supabase dashboard Table Editor.
