import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxqpafclueeolpxgxmye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cXBhZmNsdWVlb2xweGd4bXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI4MDMsImV4cCI6MjA4OTM4ODgwM30.Y7Gevpnsl_l8Q5lNs0mJAyAhi9RHpmqQmVx1sWaVER8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
