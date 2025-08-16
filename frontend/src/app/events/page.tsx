import { EventsTable } from '@/components/shared/events-table';

export default function Events() {
  return (
    <>
      <h1>Events</h1>
      <EventsTable
        title="All Contract Events"
        description="Complete overview of all recent events from the ballot contract."
        eventTypes={['GiveRight', 'Delegate', 'Vote']}
        maxEvents={10}
      />
    </>
  );
}
