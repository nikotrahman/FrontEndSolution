import * as signalR from "@microsoft/signalr";

let connection=null;

export const createSignalRConnection=()=>{
    const jwt=localStorage.getItem("token");

    connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL.replace("/api", "")}/chatHub`, {
      accessTokenFactory: () => jwt,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

    return connection;
};

export const getConnection=()=>connection;

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};