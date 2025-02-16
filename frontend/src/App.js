import React, { useState } from "react";
import axios from "axios";

export default function MediaEditor() {
  const [file, setFile] = useState(null);
  const [start, setStart] = useState("00:00:00");
  const [duration, setDuration] = useState(10);
  const [volume, setVolume] = useState(1.0);
  const [outputFile, setOutputFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("/api/upload", formData);
  };

  const handleCrop = async () => {
    const response = await axios.post("/api/crop", { filename: file.name, start, duration });
    setOutputFile(response.data.filename);
  };

  const handleVolumeAdjust = async () => {
    const response = await axios.post("/api/adjust_volume", { filename: file.name, volume });
    setOutputFile(response.data.filename);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Media Editor</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
        Upload
      </button>
      <div>
        <label>Start Time: </label>
        <input type="text" value={start} onChange={(e) => setStart(e.target.value)} />
        <label> Duration: </label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCrop}>
          Crop
        </button>
      </div>
      <div>
        <label>Volume Factor: </label>
        <input type="number" step="0.1" value={volume} onChange={(e) => setVolume(e.target.value)} />
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleVolumeAdjust}>
          Adjust Volume
        </button>
      </div>
      {outputFile && (
        <a className="text-blue-600" href={`/api/download/${outputFile}`} download>
          Download Processed File
        </a>
      )}
    </div>
  );
}
