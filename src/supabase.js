import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wopjprlscdnbptfjsfej.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcGpwcmxzY2RuYnB0ZmpzZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTU1NzYsImV4cCI6MjA4MDU3MTU3Nn0.JJrUR1gX-bJarvo9U6S1bz89R1HcYPZzzAry67isxU8';

export const supabase = createClient(supabaseUrl, supabaseKey);