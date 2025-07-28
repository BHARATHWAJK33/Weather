

import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString(); // e.g. "7:50:03 PM"
  const date = now.toLocaleDateString(); // e.g. "7/28/2025" or formatted based on locale

  return (
    <div style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' , position: 'absolute', top: '40px', right: '50px', color: '#fff' }}>
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
};

export default Clock;
