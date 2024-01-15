import { useEffect, useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

useEffect(() => {
  const fetchEvent = async () => {
    try {
    const [usersResponse, eventsResponse, categoriesResponse] = await Promise.all([
      fetch('http://localhost:3000/users'),
      fetch('http://localhost:3000/events'),
      fetch('http://localhost:3000/categories'),
    ]);

    const [userData, eventData, categoryData] = await Promise.all([
      usersResponse.json(),
      eventsResponse.json(),
      categoriesResponse.json(),
    ]);
    setEvent([userData, eventData, categoryData]);
  } catch (error) {
    console.error('Error fetching event:', error);
  }
};

  fetchEvent();
}, [eventId]);

return (
  <div>
  <Heading>Event blablabla {event ? event.title : 'Loading...'}</Heading>
    </div>
);};

export default EventPage;