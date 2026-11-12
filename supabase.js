import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Reemplaza con tu URL y Key de tu proyecto en Supabase
const SUPABASE_URL = 'https://anuytiuxilxghchvgawq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oPNN62DAmlY3ODcPCS9JAg_9gmb-hjE';

// AsyncStorage guarda la sesión en el celular para que siga iniciada al cerrar y volver a abrir la app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
