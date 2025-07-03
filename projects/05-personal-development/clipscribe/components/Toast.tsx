import React from 'react';

const Toast: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg toast-animate">
      {message}
    </div>
  );
};

export default Toast;