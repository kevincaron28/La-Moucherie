-- Two patterns in the catalogue are built for carp, and two waters name carp in
-- their own description, but the species vocabulary had no value for it.
-- Additive: no existing row changes, nothing is rewritten.
ALTER TYPE "FishSpecies" ADD VALUE IF NOT EXISTS 'CARP';
