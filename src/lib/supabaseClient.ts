import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdgacxwgbadrnvmlpecc.supabase.co';
const supabaseKey = 'sb_publishable_buaWBi35NiUjxREmapROIg_wGco-xFA';

export const supabase = createClient(supabaseUrl, supabaseKey);
