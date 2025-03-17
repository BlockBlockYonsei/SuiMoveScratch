import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Main from "./pages/Main";
import { useSuiClient } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";

function ObjectViewer() {
  const [objects, setObjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      } catch (err) {
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

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/objects" element={<ObjectViewer />} />
        </Routes>
      </Router>
    );
}