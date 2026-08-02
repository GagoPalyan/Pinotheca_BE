import { Socket } from 'socket.io';

interface UserSocket extends Socket {
  data: {
    userId: string;
  };
}

export { UserSocket };
