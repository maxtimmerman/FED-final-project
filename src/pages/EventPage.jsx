import { useEffect, useState } from "react";
import {
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  Stack,
  Checkbox,
  Box,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: null,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventResponse, categoriesResponse, usersResponse] =
          await Promise.all([
            fetch(`http://localhost:3000/events/${eventId}`),
            fetch("http://localhost:3000/categories"),
            fetch("http://localhost:3000/users"),
          ]);

        const [eventData, categoriesData, usersData] = await Promise.all([
          eventResponse.json(),
          categoriesResponse.json(),
          usersResponse.json(),
        ]);

        setEvent(eventData);
        setCategories(categoriesData);
        setUsers(usersData);

        setEditedEvent({
          title: eventData.title || "",
          description: eventData.description || "",
          image: eventData.image || "",
          startTime: eventData.startTime || "",
          endTime: eventData.endTime || "",
          categoryIds: eventData.categoryIds || [],
          createdBy: eventData.createdBy || null,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventId]);

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const categoriesData = await categoriesResponse.json();
        setCategoryOptions(categoriesData);
      } catch (error) {
        console.error("Error fetching category names:", error);
      }
    };

    fetchCategoryNames();
  }, []);

  const getUserPhoto = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.image : "";
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/events/${eventId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          navigate("/");
        } else {
          console.error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevEditedEvent) => ({
      ...prevEditedEvent,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const categoryIdsAsNumbers = editedEvent.categoryIds.map((categoryId) =>
      parseInt(categoryId, 10)
    );

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedEvent,
          categoryIds: categoryIdsAsNumbers,
        }),
      });

      if (response.ok) {
        setEvent(editedEvent);
        setShowEditModal(false);
        toast({
          title: "Event Edited",
          description: "The event was successfully edited.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error("Failed to edit event");
        toast({
          title: "Error",
          description: "Failed to edit event. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error editing event:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
      "en-EN",
      options
    );
    return formattedDateTime;
  };

  const handleCategoryCheckboxChange = (categoryId, isChecked) => {
    setEditedEvent((prev) => {
      if (isChecked) {
        // If the checkbox is checked, add the category ID to the array
        return { ...prev, categoryIds: [...prev.categoryIds, categoryId] };
      } else {
        // If the checkbox is unchecked, remove the category ID from the array
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((id) => id !== categoryId),
        };
      }
    });
  };

  const toast = useToast();

  return (
    <Box
      p="4"
      bg={event ? `url(${event.image})` : "green.500"}
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box p="4" bg="white" borderRadius="lg" boxShadow="lg" width="400px">
        <Heading mb="4" color="green.800" align="center">
          {event ? event.title : "Loading..."}
        </Heading>
        <Text fontSize="x-large" color="green.700" align="center" mb="8">
          {event ? event.description : "Loading..."}
        </Text>
        <Text color="green.600" align="center">
          Start Time: {event ? formatDateTime(event.startTime) : "Loading..."}
        </Text>
        <Text color="green.600" align="center" mb="8">
          End Time: {event ? formatDateTime(event.endTime) : "Loading..."}
        </Text>
        <Text color="green.700" align="center" mb="8">
          Categories:{" "}
          {event && event.categoryIds
            ? event.categoryIds
                .map(
                  (categoryId) =>
                    categories.find((cat) => cat.id === categoryId)?.name || ""
                )
                .join(", ")
            : "Loading..."}
        </Text>
        <Text color="green.800" mb="8">
          <span style={{ display: "flex", alignItems: "center" }}>
            Created By:{" "}
            {event ? (
              <>
                {users.find((user) => user.id === event.createdBy)?.name ||
                  "Unknown"}
                <Image
                  src={getUserPhoto(event.createdBy)}
                  boxSize="100px"
                  borderRadius="full"
                  ml="9"
                />
              </>
            ) : (
              "Loading..."
            )}
          </span>
        </Text>

        <Box align="center">
          <Button mr="2" onClick={handleEditClick} colorScheme="orange">
            Edit
          </Button>
          <Button onClick={handleDeleteClick} colorScheme="red">
            Delete
          </Button>
        </Box>

        <Modal isOpen={showEditModal} onClose={handleCloseEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              color="orange.700"
              bg="orange.100"
              borderTopRadius="lg"
              mb="4"
            >
              Edit Event
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleFormSubmit}>
                <Stack spacing={4} mb="4">
                  <Input
                    type="text"
                    name="title"
                    value={editedEvent.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                  />
                  <Textarea
                    name="description"
                    value={editedEvent.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                  />
                  <Input
                    type="text"
                    name="image"
                    value={editedEvent.image}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                  />
                  <Input
                    type="text"
                    name="startTime"
                    value={editedEvent.startTime}
                    onChange={handleInputChange}
                    placeholder="Start Time"
                  />
                  <Input
                    type="text"
                    name="endTime"
                    value={editedEvent.endTime}
                    onChange={handleInputChange}
                    placeholder="End Time"
                  />
                  {categoryOptions.map((category) => (
                    <Checkbox
                      key={category.id}
                      isChecked={editedEvent.categoryIds.includes(category.id)}
                      onChange={(e) =>
                        handleCategoryCheckboxChange(
                          category.id,
                          e.target.checked
                        )
                      }
                    >
                      {category.name}
                    </Checkbox>
                  ))}
                  <Input
                    type="text"
                    name="createdBy"
                    value={
                      users.find((user) => user.id === editedEvent.createdBy)
                        ?.name || ""
                    }
                    onChange={handleInputChange}
                    placeholder="Created By (user ID)"
                  />
                  <Button type="submit" colorScheme="orange">
                    Save Changes
                  </Button>
                </Stack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};
