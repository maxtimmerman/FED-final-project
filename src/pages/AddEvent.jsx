import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Input,
  Box,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";

export const AddEvent = ({ addEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createdByName, setCreatedByName] = useState("");
  const [createdByPhoto, setCreatedByPhoto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/categories"),
        ]);

        const [categoriesData] = await Promise.all([categoriesResponse.json()]);

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eventData = {
      title,
      description,
      image,
      startTime,
      endTime,
      categoryIds: selectedCategories,
      createdByName,
      createdByPhoto,
    };

    await addEvent(eventData);

    setTitle("");
    setDescription("");
    setImage("");
    setStartTime("");
    setEndTime("");
    setSelectedCategories([]);
    setCreatedByName("");
    setCreatedByPhoto("");
  };

  const handleCategoryCheckboxChange = (categoryId, isChecked) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (isChecked) {
        return [...prevSelectedCategories, categoryId];
      } else {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      }
    });
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

        <Box mb="2">
          <Input
            id="image"
            placeholder="Image URL"
            focusBorderColor="orange.500"
            mb="2"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Box>

        <Box mb="2">
          <label
            htmlFor="startTime"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
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
          <label
            htmlFor="endTime"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
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

        <CheckboxGroup
          name="categoryIds"
          value={selectedCategories}
          onChange={(values) => setSelectedCategories(values)}
        >
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              isChecked={selectedCategories.includes(category.id)}
              onChange={(e) =>
                handleCategoryCheckboxChange(category.id, e.target.checked)
              }
              m="4"
            >
              {category.name}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <Input
          type="text"
          placeholder="Created By (Name)"
          focusBorderColor="orange.500"
          mb="2"
          value={createdByName}
          onChange={(e) => setCreatedByName(e.target.value)}
        />

        <Input
          type="text"
          placeholder="Created By (Photo URL)"
          focusBorderColor="orange.500"
          mb="2"
          value={createdByPhoto}
          onChange={(e) => setCreatedByPhoto(e.target.value)}
        />

        <Button
          type="submit"
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
