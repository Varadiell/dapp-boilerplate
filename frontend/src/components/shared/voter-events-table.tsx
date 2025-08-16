import { EventsTable } from './events-table';

export function VoterEventsTable() {
  return (
    <EventsTable
      title="Voter Registrations"
      description="Recent voter registration and delegation events from the ballot contract."
      eventTypes={['GiveRight', 'Delegate']}
      maxEvents={5}
    />
  );
}
