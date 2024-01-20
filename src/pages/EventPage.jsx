import { useEffect, useState } from 'react';
import { Heading, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, Textarea, Stack, CheckboxGroup, Checkbox } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: '',
    description: '',
    image: '',
    startTime: '',
    endTime: '',
    categoryIds: [],
    createdBy: null,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventResponse, categoriesResponse, usersResponse] = await Promise.all([
          fetch(`http://localhost:3000/events/${eventId}`),
          fetch('http://localhost:3000/categories'),
          fetch('http://localhost:3000/users'),
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
          title: eventData.title || '',
          description: eventData.description || '',
          image: eventData.image || '',
          startTime: eventData.startTime || '',
          endTime: eventData.endTime || '',
          categoryIds: eventData.categoryIds || [],
          createdBy: eventData.createdBy || null,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const categoriesResponse = await fetch('http://localhost:3000/categories');
        const categoriesData = await categoriesResponse.json();
        setCategoryOptions(categoriesData);
      } catch (error) {
        console.error('Error fetching category names:', error);
      }
    };

    fetchCategoryNames();
  }, []);

  const handleEditClick = () => {
    setShowEditModal(true);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEvent),
      });

      if (response.ok) {
        setEvent(editedEvent);
        setShowEditModal(false);
      } else {
        console.error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div>
      <Heading>{event ? event.title : 'Loading...'}</Heading>
      <p>Description: {event ? event.description : 'Loading...'}</p>
      <p>Image: {event ? <img src={event.image} alt={event.title} style={{ maxWidth: '300px' }} /> : 'Loading...'}</p>
      <p>Start Time: {event ? event.startTime : 'Loading...'}</p>
      <p>End Time: {event ? event.endTime : 'Loading...'}</p>
      <p>Categories: {event ? event.categoryIds.map((categoryId) => categories.find((cat) => cat.id === categoryId)?.name || '').join(', ') : 'Loading...'}</p>
      <p>Created By: {event ? users.find((user) => user.id === event.createdBy)?.name || 'Unknown' : 'Loading...'}</p>

      <Button onClick={handleEditClick}>Edit</Button>

      <Modal isOpen={showEditModal} onClose={handleCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <Stack spacing={4}>
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
                <CheckboxGroup
                  name="categoryIds"
                  value={editedEvent.categoryIds}
                  onChange={(values) => setEditedEvent({ ...editedEvent, categoryIds: values })}
                >
                  {categoryOptions.map((category) => (
                    <Checkbox key={category.id} value={category.id}>
                      {category.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>

                {/* Created By - You might want to use a dropdown to select a user */}
                <Input
                  type="text"
                  name="createdBy"
                  value={editedEvent.createdBy}
                  onChange={handleInputChange}
                  placeholder="Created By (user ID)"
                />
                <Button type="submit">Save Changes</Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
