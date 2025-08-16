import { EventsTable } from './events-table';

export function VoteEventsTable() {
  return (
    <EventsTable
      title="Voting Activity"
      description="Recent voting events from the ballot contract."
      eventTypes={['Vote']}
      maxEvents={5}
    />
  );
}
