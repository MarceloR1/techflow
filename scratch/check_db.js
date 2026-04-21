const { supabase } = require('../server/supabaseClient');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });


async function checkRoles() {
    const { data: roles, error } = await supabase.from('roles').select('*');
    if (error) {
        console.error('Error fetching roles:', error);
        return;
    }
    console.log('Current Roles:', roles);
}

checkRoles();
