-- ============================================================
-- SMARTLEARN — Esquema de Base de Datos
-- Proyecto: Plataforma web de micro-aprendizaje
-- Stack: PostgreSQL alojado en Supabase
-- ============================================================


-- ------------------------------------------------------------
-- TABLA: mazos (explicacion de el bloque de codigo)
-- Representa las categorías de estudio que cada usuario crea.
-- Cada mazo pertenece a un usuario registrado en Supabase (Auth).
-- La columna usuario_id referencia auth.users que es la tabla
-- interna de Supabase, por lo que no se creo manualmente.
-- Si un usuario es eliminado, sus mazos se borran en cascada.
-- Requerimiento relacionado: RF-03
-- ------------------------------------------------------------
CREATE TABLE mazos (
  mazo_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  descripcion     TEXT,
  fecha_creacion  TIMESTAMP DEFAULT NOW()
);


-- ------------------------------------------------------------
-- TABLA: recursos (explicacion de el bloque de codigo)
-- Almacena los materiales de estudio vinculados a un mazo.
-- Cada recurso puede ser de tipo 'url' (enlace externo)
-- o 'pdf' (archivo subido al almacenamiento de Supabase).
-- El campo tamanio_mb permite validar el limite de 10MB
-- definido en el requerimiento RF-10.
-- Si el mazo padre es eliminado, sus recursos se borran tambien.
-- Requerimiento relacionado: RF-04, RF-10
-- ------------------------------------------------------------
CREATE TABLE recursos (
  recurso_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mazo_id     UUID NOT NULL REFERENCES mazos(mazo_id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL CHECK (tipo IN ('url', 'pdf')),
  url_o_ruta  TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  tamanio_mb  FLOAT
);


-- ------------------------------------------------------------
-- TABLA: flashcards (explicacion de el bloque de codigo)
-- Almacena las tarjetas de estudio de pregunta y respuesta.
-- Los campos intervalo_dias, factor_facilidad y repeticiones
-- son los valores que el algoritmo SM-2 necesita para calcular
-- la proxima fecha de repaso de cada tarjeta.
-- prox_revision es la fecha en que la tarjeta debe aparecer
-- nuevamente en el Modo Estudio del usuario.
-- Si el mazo padre es eliminado, sus flashcards también.
-- Requerimiento relacionado: RF-06, RF-07, RF-08, RF-09
-- ------------------------------------------------------------
CREATE TABLE flashcards (
  flashcard_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mazo_id           UUID NOT NULL REFERENCES mazos(mazo_id) ON DELETE CASCADE,
  pregunta          TEXT NOT NULL,
  respuesta         TEXT NOT NULL,
  prox_revision     DATE DEFAULT NOW(),
  intervalo_dias    INT DEFAULT 1,
  factor_facilidad  FLOAT DEFAULT 2.5,
  repeticiones      INT DEFAULT 0
);


-- ------------------------------------------------------------
-- INDICES
-- Mejoran la velocidad de las consultas mas frecuentes
-- del sistema sin afectar la estructura de las tablas.
-- idx_mazos_usuario: acelera buscar los mazos de un usuario.
-- idx_recursos_mazo: acelera buscar recursos dentro de un mazo.
-- idx_flashcards_mazo: acelera buscar tarjetas de un mazo.
-- idx_flashcards_fecha: acelera el filtrado del Dashboard
-- que muestra solo las tarjetas con repaso pendiente hoy.
-- Requerimiento relacionado: F-06 Filtrado de Dashboard
-- ------------------------------------------------------------
CREATE INDEX idx_mazos_usuario    ON mazos(usuario_id);
CREATE INDEX idx_recursos_mazo    ON recursos(mazo_id);
CREATE INDEX idx_flashcards_mazo  ON flashcards(mazo_id);
CREATE INDEX idx_flashcards_fecha ON flashcards(prox_revision);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Politicas de seguridad que garantizan que cada usuario
-- unicamente pueda ver, crear, editar y eliminar sus propios
-- datos. auth.uid() retorna el ID del usuario autenticado
-- en la sesion actual mediante Supabase Auth.
-- Requerimiento relacionado: RNF-04 (Seguridad Basica)
-- ============================================================

-- ------------------------------------------------------------
-- RLS: mazos
-- Un usuario solo puede operar sobre los mazos donde
-- su usuario_id coincide con el ID de su sesion activa.
-- ------------------------------------------------------------
ALTER TABLE mazos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario ve sus mazos"
  ON mazos FOR SELECT
  USING (usuario_id = auth.uid());

CREATE POLICY "usuario crea sus mazos"
  ON mazos FOR INSERT
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "usuario edita sus mazos"
  ON mazos FOR UPDATE
  USING (usuario_id = auth.uid());

CREATE POLICY "usuario elimina sus mazos"
  ON mazos FOR DELETE
  USING (usuario_id = auth.uid());


-- ------------------------------------------------------------
-- RLS: recursos
-- Un usuario solo puede operar sobre recursos que pertenezcan
-- a mazos que le corresponden. Se verifica haciendo una
-- subconsulta que confirma que el mazo_id del recurso
-- pertenece a un mazo del usuario autenticado.
-- ------------------------------------------------------------
ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario ve sus recursos"
  ON recursos FOR SELECT
  USING (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "usuario crea sus recursos"
  ON recursos FOR INSERT
  WITH CHECK (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "usuario edita sus recursos"
  ON recursos FOR UPDATE
  USING (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "usuario elimina sus recursos"
  ON recursos FOR DELETE
  USING (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );


-- ------------------------------------------------------------
-- RLS: flashcards
-- Igual que recursos, se verifica que el mazo_id de la
-- flashcard pertenezca a un mazo del usuario autenticado.
-- Esto garantiza el aislamiento total de datos entre usuarios.
-- ------------------------------------------------------------
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario ve sus flashcards"
  ON flashcards FOR SELECT
  USING (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "usuario crea sus flashcards"
  ON flashcards FOR INSERT
  WITH CHECK (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "usuario edita sus flashcards"
  ON flashcards FOR UPDATE
  USING (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "usuario elimina sus flashcards"
  ON flashcards FOR DELETE
  USING (
    mazo_id IN (
      SELECT mazo_id FROM mazos WHERE usuario_id = auth.uid()
    )
  );
