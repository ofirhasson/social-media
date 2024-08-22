import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | undefined;

  public connect(): void {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_BACKEND_URL);

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        this.socket = undefined; // Reset socket on disconnect
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined; // Reset socket after disconnecting
      console.log("Disconnected from WebSocket server manually");
    }
  }

  public on(event: string, callback: Function): void {
    if (this.socket) {
      this.socket.on(event, (data: any) => {
        callback(data);
      });
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
