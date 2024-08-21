import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the import path if necessary

export const Details = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
      >
        Logout
      </button>
    </div>
  );
};
