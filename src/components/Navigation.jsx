import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* <li>
          <Link to="/event/1">Event</Link>
        </li> */}
      </ul>
    </nav>
  );
};
