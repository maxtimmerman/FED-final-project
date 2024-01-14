import React, { useEffect, useState } from 'react';
import {
  Heading,
  SimpleGrid,
  Card,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Box,
  Checkbox
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AddEvent } from './AddEvent';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [eventsResponse, categoriesResponse] = await Promise.all([
        fetch('http://localhost:3000/events'),
        fetch('http://localhost:3000/categories'),
      ]);

      const [eventsData, categoriesData] = await Promise.all([
        eventsResponse.json(),
        categoriesResponse.json(),
      ]);

      setEvents(eventsData);
      setCategories(categoriesData);
    };

    fetchData();
  }, []);

  const addEvent = async (event) => {
    const response = await fetch('http://localhost:3000/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });

    event.id = (await response.json()).id;
    setEvents((prevEvents) => [...prevEvents, event]);
    setShowAddEventModal(false);
  };

  const handleAddEventClick = () => {
    setShowAddEventModal(true);
  };

  const handleCloseModal = () => {
    setShowAddEventModal(false);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };

  const filteredEvents = events.filter((event) => {
    const titleLowerCase = event.title?.toLowerCase() || '';
    const descriptionLowerCase = event.description?.toLowerCase() || '';

    const titleMatches = titleLowerCase.includes(searchTerm);
    const descriptionMatches = descriptionLowerCase.includes(searchTerm);

    const categoryMatches =
      selectedCategories.length === 0 ||
      (event.categoryIds && event.categoryIds.some((categoryId) => selectedCategories.includes(categoryId)));

    return (titleMatches || descriptionMatches) && categoryMatches;
  });

  return (
    <div className='App'>
      <Heading>List of events</Heading>

      <Input
        type='text'
        placeholder='Search events...'
        value={searchTerm}
        onChange={handleSearch}
      />

      <Box>
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            isChecked={selectedCategories.includes(category.id)}
            onChange={() => handleCategoryToggle(category.id)}
          >
            {category.name}
          </Checkbox>
        ))}
      </Box>

      <ul>
        <SimpleGrid columns={(1, 2, 3)} spacingY='20px'>
          {filteredEvents.map((event) => (
            <li key={event.id}>
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card key={event.id} maxW='300px'>
                  <Image
                    src={event.image}
                    alt={event.title}
                    borderRadius='lg'
                  />
                  <Text>{event.title}</Text>
                  <Text>{event.description}</Text>
                  <Text>{event.startTime}</Text>
                  <Text>{event.endTime}</Text>
                  <Text>Category: {event.categoryIds ? event.categoryIds.map(getCategoryName).join(', ') : 'None'}</Text>
                </Card>
              </Link>
            </li>
          ))}
        </SimpleGrid>
      </ul>

      <Button onClick={handleAddEventClick}>Add Event</Button>

      <Modal isOpen={showAddEventModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddEvent addEvent={addEvent} />
          </ModalBody>
          <ModalFooter>
            {/* You can add additional buttons or actions here if needed */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
