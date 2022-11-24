import { useEffect, useState } from 'react';
import styles from './user-card.module.scss';
import { User } from './user.interface';
import clsx from 'clsx';
import { io } from 'socket.io-client';
import { API_HOST, API_PORT } from './app.config';

const SOCKET_NAMESPACE = 'user';
const socketUrl = `ws://${API_HOST}:${API_PORT}/${SOCKET_NAMESPACE}`;
const socket = io(socketUrl);

const UserStatus = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  /**
   * Inits the socket features, and cleans it on destroy
   */
  useEffect(() => {
    socket.on('connect', onSocketConnect);
    socket.on('disconnect', onSocketDisconnect);
    socket.on('events', onUserFoundEvents);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  /**
   * Event fired on websocket connect
   */
  const onSocketConnect = () => {
    setIsConnected(true);

    socket.emit('events');
  };

  /**
   * Event fired on websocket disconnect
   */
  const onSocketDisconnect = () => setIsConnected(false);

  /**
   * Event fired when user is found
   */
  const onUserFoundEvents = (user: User) => setUser(user);

  /**
   * Updates user's status to ready
   * Emits value to the server, and then updates the state locally
   * @param user the user to set ready
   * @returns nothing
   */
  const setUserReady = (user: User | null) => {
    if (!user) return;

    socket.emit('ready', user, (response: User) => setUser({ ...response }));
  };

  return (
    <div className={styles['container']}>
      <p>
        <b>Etat de la connexion :</b>
        {(isConnected && (
          <span className={clsx(styles['bullet'], styles['green'])} />
        )) || <span className={clsx(styles['bullet'], styles['red'])} />}
      </p>
      <p>
        <b>Utilisateur :</b> {user?.name}
      </p>
      {(!user?.isReady && (
        <button onClick={() => setUserReady(user)} className={styles['button']}>
          Prêt à commencer
        </button>
      )) || (
        <span role="img" aria-label="ready">
          ✅&nbsp;&nbsp;Prêt
        </span>
      )}
    </div>
  );
};

export default UserStatus;
