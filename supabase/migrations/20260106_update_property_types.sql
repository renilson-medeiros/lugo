-- Migration: Update property types allowed in the imoveis table
-- This adds 'kitnet', 'studio', and 'cobertura' to the allowed types.

-- First, we need to find the constraint name. 
-- Since it was created inline, it might have a generated name like 'imoveis_tipo_check'.
-- We will attempt to drop it if it exists and create the new one.

ALTER TABLE imoveis 
DROP CONSTRAINT IF EXISTS imoveis_tipo_check;

ALTER TABLE imoveis 
ADD CONSTRAINT imoveis_tipo_check 
CHECK (tipo IN ('casa', 'apartamento', 'comercial', 'terreno', 'kitnet', 'studio', 'cobertura'));
