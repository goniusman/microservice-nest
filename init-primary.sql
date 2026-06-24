-- Create a dedicated user for streaming WAL
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_password';

-- Create a physical replication slot
SELECT pg_create_physical_replication_slot('main_replica_slot');
-- SELECT pg_create_physical_replication_slot('main_replica_slot');
















