import React from 'react';

const Avatar = ({ name, size = '100px' }) => {
  // Generate a consistent color based on the name
  const getBackgroundColor = (str) => {
    const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9b59b6', '#34495e'];
    if (!str) return colors[0];
    const charCodeSum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const bgColor = getBackgroundColor(name);

  const style = {
    width: size,
    height: size,
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: 'white',
    fontSize: `calc(${size} / 2)`,
    fontWeight: '500',
    fontFamily: 'Roboto, Arial, sans-serif',
    border: '4px solid white', // Matches your dashboard look
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  };

  return <div style={style}>{initial}</div>;
};

export default Avatar;