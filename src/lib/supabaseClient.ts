import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qpeoyqhillxhcrphwure.supabase.co';
const supabaseKey = 'sb_publishable_0xTl22ZshUG0ilmcPx1Yfg_IsWOBx6Y';

export const supabase = createClient(supabaseUrl, supabaseKey);
