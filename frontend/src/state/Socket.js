import io from 'socket.io-client';

class Socket {
    static instance;

    constructor(url) {
        if (Socket.instance) {
            return Socket.instance;
        }

        this.socket = io(url);
        Socket.instance = this;

        this.socket.connect();
    }

    connect() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
    }

    on(eventName, callback) {
        this.socket.on(eventName, callback);
    }

    emit(eventName, data) {
        this.socket.emit(eventName, data);
    }

    disconnect() {
        this.socket.disconnect();
    }

    static getInstance(url) {
        if (!Socket.instance) {
            Socket.instance = new Socket(url);
        }
        return Socket.instance;
    }
}

export default Socket;
