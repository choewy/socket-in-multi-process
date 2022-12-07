import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:30001', {
  autoConnect: true,
  transports: ['websocket'],
});

const App = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('hi::to-user', (data) => console.log(data));

    return () => {
      socket.off('hi::to-user');
    };
  }, []);

  return (
    <div>
      <h1>APP</h1>
      <button onClick={() => socket.emit('user::say-hi')}>Hi!</button>
    </div>
  );
};

export default App;
