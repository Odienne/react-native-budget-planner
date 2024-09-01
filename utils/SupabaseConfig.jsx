import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://riixpnnjgwbvfzuvtnnf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaXhwbm5qZ3didmZ6dXZ0bm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMjE1NjMsImV4cCI6MjA0MDU5NzU2M30.rhqWgpA-QRb8ZJsGtkjbYpTGZCa5hTzo7mWkvuonoOE')
