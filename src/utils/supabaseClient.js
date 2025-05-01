import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkybojeeumeqweacaizg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdreWJvamVldW1lcXdlYWNhaXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzU1NjMsImV4cCI6MjA1OTc1MTU2M30.o_UBLFrA7quCuFG6V1HQ6KrnOYxCR85CCozqUs_RdMQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
