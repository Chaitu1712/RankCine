import { initializeApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from './dataconnect-generated';

const firebaseConfig = {
  projectId: "rankcine-d1a2c",
};

const app = initializeApp(firebaseConfig);

export const dataConnect = getDataConnect(app, connectorConfig);

connectDataConnectEmulator(dataConnect, 'localhost', 9399);