-- Wedding Wishes Table
CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVP Table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('hadir', 'tidak-hadir')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Policies for wishes table (public can insert and read)
CREATE POLICY "Anyone can insert wishes"
  ON wishes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view wishes"
  ON wishes
  FOR SELECT
  TO public
  USING (true);

-- Policies for rsvps table (public can only insert)
CREATE POLICY "Anyone can insert RSVPs"
  ON rsvps
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Optional: Create an index for faster queries
CREATE INDEX wishes_created_at_idx ON wishes(created_at DESC);
CREATE INDEX rsvps_created_at_idx ON rsvps(created_at DESC);
