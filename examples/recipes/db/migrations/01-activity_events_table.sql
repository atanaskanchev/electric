/* This is an example of an SQL DDL migration. It creates tables and
 * then calls an `electric.electrify` procedure to expose the tables to the
 * ElectricSQL replication machinery.
 *
 * Note that these statements are applied directly to the *Postgres* database.
 * Electric then handles keeping the local SQLite database schema in sync with
 * the electrified subset of your Postgres database schema.
 *
 * See https://electric-sql.com/docs/usage/data-modelling for more information.
 */

-- Create a simple activity events table.
CREATE TABLE IF NOT EXISTS activity_events (
  id UUID PRIMARY KEY NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  message TEXT NOT NULL,
  action TEXT,
  read_at TIMESTAMPTZ
);

-- ⚡
-- Electrify the items table
ALTER TABLE activity_events ENABLE ELECTRIC;
