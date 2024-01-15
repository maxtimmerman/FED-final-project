import { useState } from "react";

export const AddEvent = ({ addEvent }) => {
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);
  const [image, setImage] = useState([]);
  const [location, setLoaction] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [endTime, setEndTime] = useState([]);

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
      Add your event
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          placeholder="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLoaction(e.target.value)}
        />
        <input
          type="text"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};