// src/hooks/useSocket.js
import { useSocket as useSocketContext } from '../context/SocketContext';

export const useSocket = () => {
  return useSocketContext();
};