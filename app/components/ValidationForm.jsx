"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { handleFormSubmit } from "../controllers/file";

export default function ValidationForm() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState("Processing...");

  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("test");
  const [validation, setValidation] = useState("all");
  const [clearPrevious, setClearPrevious] = useState(true);
  const [tickLiveId, setTickLiveId] = useState(false);

  const [credits, setCredits] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      file: file,
      validation_mode: mode,
      validation_limit: validation,
      clear_previous: clearPrevious,
      live_status: tickLiveId,
    }

    if (!formData.file) return alert("Please upload a CSV file first.");

    setLoading(true)
    const upload = await handleFormSubmit(formData.file);

    if (!upload?.success) {
      console.log(upload);
      alert(upload?.message);
    }

    if (upload?.success && upload?.file) {

      setCurrentTask("Validating contacts...");
      try {

        console.log("Submitting file to validate...")
        const validation = await fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, fileUrl: upload?.file }),
        });

        setCurrentTask("Saving validated contacts...");

        const result = await validation.json();
        if (result.success) {
          // Save results to session storage (to read on /results)
          sessionStorage.setItem("validationResults", JSON.stringify(result));
          router.push("/result");
        } else {
          console.log("/api/validate failure result: ", result)
        }

      } catch (error) {
        console.log(error)
        alert(error)
      }

    }

    setLoading(false)
  };

  useEffect(() => {
    const fetchCredits = async () => {
      const res = await fetch("/api/credits");
      const data = await res.json();
      setCredits(data);
    }
    fetchCredits();
  }, [])

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lgx mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-6 text-dark w-100"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Unified Phone Intelligence Platform
        </h2>

        <div className="flex justify-end text-black">

          <div className="text-left space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Credits Remaining:
            </p>

            <div className="flex items-center justify-start gap-2">
              <span className="text-sm">Standard:</span>
              <span className="badge bg-blue-100 text-black px-2 py-1 rounded-md">
                {credits && credits?.remaining?.standard || ''} / {credits && credits?.cap?.standardMax || ''}
              </span>
              -
              <span className="text-sm">Live Status:</span>
              <span className="badge bg-orange-100 text-black px-2 py-1 rounded-md">
                {credits && credits?.remaining?.withLive || ''} / {credits && credits?.cap?.withLiveMax || ''}
              </span>
            </div>
          </div>
        </div>

        {/* Seamless AI CSV File */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Seamless AI CSV File
          </label>
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
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
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg text-black"
          >
            <option value="real">Real API</option>
            <option value="test">Test Mode</option>
          </select>
        </div>

        {/* Validation Limit */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Validation Limit
          </label>
          <select
            name="validation_limit"
            value={validation}
            onChange={(e) => setValidation(e.target.value)}
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
                value={true}
                checked={clearPrevious === true}
                onChange={(e) => setClearPrevious(e.target.value)}
              />
              Start Fresh
            </label>
            <label className="flex items-center gap-2  text-black">
              <input
                type="radio"
                name="dataHandling"
                value={false}
                checked={clearPrevious === true}
                onChange={(e) => setClearPrevious(e.target.value)}
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
              type="checkbox"
              name="live_status"
              checked={tickLiveId}
              onChange={() => setTickLiveId(!tickLiveId)}
            />
            Check Live Status
          </label>
        </div>

        <button
          type="submit"
          disabled={credits && !credits.hasEnoughCredits}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Process Complete Workflow
        </button>
      </form>
      {/* Spinner Modal */}
      {loading && (
        <div className="fixed inset-0 flex items-center bg-white justify-center bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">{currentTask}</p>
          </div>
        </div>
      )}
    </>
  );
}
