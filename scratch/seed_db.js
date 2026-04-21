const { supabase } = require('../server/supabaseClient');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function seedRoles() {
    const roles = ['Administrador', 'Auditor', 'Ventas', 'Cliente'];
    
    for (const roleName of roles) {
        const { data, error } = await supabase
            .from('roles')
            .select('id')
            .eq('name', roleName)
            .single();
        
        if (error || !data) {
            console.log(`Creando rol: ${roleName}...`);
            await supabase.from('roles').insert([{ name: roleName }]);
        } else {
            console.log(`Rol ya existe: ${roleName}`);
        }
    }
    
    // Check if clients table has user_id (optional verification)
    console.log("Verificando tabla clients...");
    const { data: clientCols, error: colErr } = await supabase.from('clients').select('*').limit(1);
    if (colErr) {
        console.error("Error al acceder a clients. Asegúrate de ejecutar el SQL de migración en Supabase.");
    } else {
        console.log("Tabla clients accesible.");
    }
}

seedRoles().then(() => console.log("Done."));
