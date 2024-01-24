import React, { useEffect, useState } from "react";
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
  ModalBody,
  ModalCloseButton,
  Input,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AddEvent } from "./AddEvent";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [eventsResponse, categoriesResponse] = await Promise.all([
        fetch("http://localhost:3000/events"),
        fetch("http://localhost:3000/categories"),
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
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
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
    return category ? category.name : "Unknown Category";
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
    const titleLowerCase = event.title?.toLowerCase() || "";
    const descriptionLowerCase = event.description?.toLowerCase() || "";

    const titleMatches = titleLowerCase.includes(searchTerm);
    const descriptionMatches = descriptionLowerCase.includes(searchTerm);

    const categoryMatches =
      selectedCategories.length === 0 ||
      (event.categoryIds &&
        event.categoryIds.some((categoryId) =>
          selectedCategories.includes(categoryId)
        ));

    return (titleMatches || descriptionMatches) && categoryMatches;
  });

  return (
    <div className="App">
      <Box p="4" bg="green.500" textAlign="center">
        <Heading as="h1" mb="4" color="white" textAlign="center">
          List of events
        </Heading>

        <Input
          mb="4"
          bg="white"
          color="green.900"
          maxW="400px"
          type="text"
          textAlign="center"
          placeholder="Search events..."
          focusBorderColor="orange.500"
          value={searchTerm}
          onChange={handleSearch}
        />

        <Box mb="4">
          {categories.map((category) => (
            <Checkbox
              color="white"
              size="lg"
              colorScheme="orange"
              mr="3"
              key={category.id}
              isChecked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryToggle(category.id)}
            >
              {category.name}
            </Checkbox>
          ))}
        </Box>

        <Button
          onClick={handleAddEventClick}
          width="400px"
          mb="6"
          bg="white"
          color="green.600"
        >
          Click here to add your event
        </Button>

        <Modal isOpen={showAddEventModal} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AddEvent addEvent={addEvent} />
            </ModalBody>
          </ModalContent>
        </Modal>

        <SimpleGrid columns={[1, 2, 4]} spacing={8}>
          {filteredEvents.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <Card
                key={event.id}
                p="0"
                borderWidth="0px"
                boxShadow="lg"
                borderRadius="lg"
                cursor="pointer"
                transition="transform 0.2s ease-in-out"
                _hover={{
                  transform: "scale(1.1)",
                }}
                bg="white"
                minW="200px"
                maxW="300px"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  borderRadius="lg"
                  mb="4"
                  h="170px"
                  w="100%"
                  objectFit="cover"
                />
                <Text
                  color="green.800"
                  fontWeight="bold"
                  fontSize="md"
                  textTransform="uppercase"
                >
                  {event.title}
                </Text>
                <Text color="green.700" pb="4">
                  {event.description}
                </Text>
                <Text color="green.600">Start: {event.startTime}</Text>
                <Text color="green.600" pb="4">
                  End: {event.endTime}
                </Text>
                <Text color="green.500" pb="6">
                  Category:{" "}
                  {event.categoryIds
                    ? event.categoryIds.map(getCategoryName).join(", ")
                    : "None"}
                </Text>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};
