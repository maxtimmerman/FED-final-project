import { useState } from "react";
import { Button, Heading, Input, Box } from "@chakra-ui/react";

export const AddEvent = ({ addEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLoaction] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    addEvent({ title, description, image, location, startTime, endTime });

    setTitle("");
    setDescription("");
    setImage("");
    setLoaction("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div>
      <Heading size="lg" color="orange.700" m="4">
        Please fill in the details to add your event
      </Heading>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          focusBorderColor="orange.500"
          mb="2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Description"
          focusBorderColor="orange.500"
          mb="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box position="relative" mb="2">
          <Button
            as="label"
            htmlFor="fileInput"
            colorScheme="orange"
            cursor="pointer"
            width="100%"
          >
            Upload Image
          </Button>
          <Input
            type="file"
            id="fileInput"
            display="none"
            onChange={(e) => setImage(e.target.value)}
          />
        </Box>

        <Input
          type="text"
          placeholder="Location"
          focusBorderColor="orange.500"
          mb="2"
          value={location}
          onChange={(e) => setLoaction(e.target.value)}
        />

        <Box mb="2">
          <label htmlFor="startTime" style={{ display: "block", marginBottom: "0.5rem" }}>
            Start Time
          </label>
          <Input
            id="startTime"
            placeholder="Start Time"
            focusBorderColor="orange.500"
            mb="2"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Box>

        <Box mb="2">
          <label htmlFor="endTime" style={{ display: "block", marginBottom: "0.5rem" }}>
            End Time
          </label>
          <Input
            id="endTime"
            type="datetime-local"
            placeholder="End Time"
            focusBorderColor="orange.500"
            mb="2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Box>

        <Button
            as="label"
            htmlFor="fileInput"
            colorScheme="orange"
            cursor="pointer"
            width="100%"
            mb="4"
          >
          Add Event
        </Button>
      </form>
    </div>
  );
};
