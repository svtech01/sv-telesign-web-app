"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ValidationForm() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    validation_mode: "real",
    validation_limit: "all",
    clear_previous: "true",
    live_status: "true",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return alert("Please upload a CSV file first.");

    try {
      
      setLoading(true);
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // Save results to session storage (to read on /results)
        sessionStorage.setItem("validationResults", JSON.stringify(data));
        router.push("/result");
      } else {
        alert("Validation failed: " + data.error);
      }

    } catch (error) {
      setLoading(false)
      alert(error)
    }
  };

  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="max-w-lgx mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-6 text-dark w-100"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Unified Phone Intelligence Platform
      </h2>

      {/* Seamless AI CSV File */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Seamless AI CSV File
        </label>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg text-black"
          required
        />
      </div>

      {/* Validation Mode */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Validation Mode
        </label>
        <select
          name="validation_mode"
          value={formData.validation_mode}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg text-black" 
        >
          <option value="real">Real API</option>
          <option value="test" disabled>Test Mode</option>
        </select>
      </div>

      {/* Validation Limit */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Validation Limit
        </label>
        <select
          name="validation_limit"
          value={formData.validation_limit}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg text-black"
        >
          <option value="all">Validate all contacts</option>
          <option value="100" disabled>
            Validate first 100 contacts
          </option>
        </select>
      </div>

      {/* Data Handling */}
      <div>
        <label className="block font-medium text-gray-700 mb-2 ">
          Data Handling
        </label>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-black">
            <input
              type="radio"
              name="clear_previous"
              value="true"
              checked={formData.clear_previous === "true"}
              onChange={handleChange}
            />
            Start Fresh
          </label>
          <label className="flex items-center gap-2  text-black">
            <input
              type="radio"
              name="dataHandling"
              value="false"
              checked={formData.clear_previous === "false"}
              onChange={handleChange}
              disabled={true}
            />
            Append
          </label>
        </div>
      </div>

      {/* Phone ID Live Status */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Phone ID Live Status
        </label>
        <label className="flex items-center gap-2 text-black">
          <input
            type="radio"
            name="live_status"
            value="true"
            checked={formData.live_status === "true"}
            onChange={handleChange}
          />
          Check Live Status
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Process Complete Workflow
      </button>
    </form>
    {/* Spinner Modal */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}
    </>
  );
}
