import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = new Map();
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      query: { userId },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.callbacks.clear();
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      // Store callback reference for cleanup
      if (!this.callbacks.has(event)) {
        this.callbacks.set(event, []);
      }
      this.callbacks.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      // Remove from callbacks map
      if (this.callbacks.has(event)) {
        const callbacks = this.callbacks.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Chat related methods
  joinChatRoom(chatId) {
    this.emit('joinChat', chatId);
  }

  leaveChatRoom(chatId) {
    this.emit('leaveChat', chatId);
  }

  sendMessage(chatData) {
    this.emit('sendMessage', chatData);
  }

  // Location related methods
  updateLocation(locationData) {
    this.emit('updateLocation', locationData);
  }

  // Notification methods
  sendNotification(notificationData) {
    this.emit('notification', notificationData);
  }

  // Listing related methods
  broadcastListingUpdate(listingData) {
    this.emit('listingUpdate', listingData);
  }

  // User status methods
  updateUserStatus(status) {
    this.emit('userStatusUpdate', status);
  }

  // Generic method to listen for any event
  listen(event, callback) {
    this.on(event, callback);
  }

  // Generic method to stop listening for any event
  stopListening(event, callback) {
    this.off(event, callback);
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket ? this.socket.id : null;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;