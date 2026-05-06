const { createClient } = require('@supabase/supabase-js');

const verificarTokenSupabase = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Token de autorización faltante o inválido" });
        }
        
        const token = authHeader.split(' ')[1];

        //creamos el cliente temporal autenticado
        const supabaseAuthClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY,
            {
                global: { 
                    headers: 
                    { Authorization: `Bearer ${token}` } }
            }
        );

        
        // para que cualquier controlador pueda usarlo
        req.supabaseClient = supabaseAuthClient;
        next();

    } catch (error) {
        console.error("Error en middleware de auth:", error);
        res.status(500).json({ error: "Error interno al validar la sesión" });
    }
};

module.exports = verificarTokenSupabase;