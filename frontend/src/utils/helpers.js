// src/utils/helpers.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours = (now - messageDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return formatTime(date);
  } else if (diffInHours < 168) { // Less than a week
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return formatDate(date);
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'available':
      return '#10b981';
    case 'pending':
      return '#f59e0b';
    case 'completed':
      return '#6366f1';
    case 'cancelled':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

export const CATEGORIES = [
  { value: 'fruits', label: 'Fruits & Vegetables' },
  { value: 'grains', label: 'Grains & Pulses' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'bakery', label: 'Bakery & Snacks' },
  { value: 'cooked', label: 'Cooked Food' },
  { value: 'other', label: 'Other' }
];
