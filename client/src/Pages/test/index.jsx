import React, { useEffect, useState } from 'react';
import './style.scss';
const Test = () => {
  const data = [
    {
      image:
        'https://images.unsplash.com/photo-1718809070453-47e72a835635?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Anh 1',
    },
    {
      image:
        'https://images.unsplash.com/photo-1718809070379-775da172aff0?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Anh 2',
    },
    {
      image:
        'https://images.unsplash.com/photo-1718809070329-702108c2585d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Anh 3',
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container">
      <div className="row">
        {data.map((item, index) => (
          <div
            className={`image ${index === currentImageIndex ? 'active' : ''}`}
            key={index}
          >
            <img src={item.image} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
