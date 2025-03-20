import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Main from "./pages/Main/Main";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";

function ObjectViewer() {
  const [objects, setObjects] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = useSuiClient();
  const address = "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad";
  
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(true);
        const response = await client.getOwnedObjects({
          owner: address
        });
        setObjects(response);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching objects:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchObjects();
  }, [client]);
  
  if (loading) return <div>Loading objects...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="object-viewer">
      <h2>Objects owned by address:</h2>
      <p className="address">{address}</p>
      <div className="objects-container">
        <pre>{JSON.stringify(objects, null, 2)}</pre>
      </div>
    </div>
  );
}

function ModuleViewer() {
  const packageId = "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175";
  
  const { data, isLoading, error } = useSuiClientQuery(
    'getNormalizedMoveModulesByPackage',
    {
      packageId: packageId,
    }
  );
  
  if (isLoading) return <div>Loading package data...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  
  // Basic formatter to make the output prettier
  const formatModules = () => {
    if (!data) return null;
    
    return (
      <div>
        {Object.keys(data).map((moduleName) => (
          <div key={moduleName} className="mb-6">
            <h3 className="text-xl font-medium">{moduleName}</h3>
            <div className="ml-4">
              <h4 className="font-medium mt-2">Functions:</h4>
              <ul className="list-disc ml-8">
                {Object.keys(data[moduleName].exposedFunctions || {}).map((funcName) => (
                  <li key={funcName}>
                    {funcName}
                  </li>
                ))}
              </ul>
              
              <h4 className="font-medium mt-2">Structs:</h4>
              <ul className="list-disc ml-8">
                {Object.keys(data[moduleName].structs || {}).map((structName) => (
                  <li key={structName}>
                    {structName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="module-viewer">
      <h2 className="text-2xl mb-4">Package Modules:</h2>
      <p className="mb-4">{packageId}</p>
      <div className="modules-container">
        {formatModules()}
      </div>
      <div className="mt-8">
        <h3 className="text-xl mb-4">Raw Data:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/objects" element={<ObjectViewer />} />
          <Route path="/modules" element={<ModuleViewer />} />
        </Routes>
      </Router>
    );
}