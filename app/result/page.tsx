"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

export default function ResultsPage() {

  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({
    uploaded: 1250,
    sanitized: 1200,
    telesignValidated: 1185,
    lowRisk: 1170,
    csvFile: {
      downloadUrl: null,
      fileName: null
    }
  });

  useEffect(() => {
    try {
      const sessiondata = sessionStorage.getItem("validationResults");
      const validationResults = sessiondata ? JSON.parse(sessiondata) : null
      if(validationResults != null) {
        setResults({
          uploaded: validationResults.total,
          sanitized: validationResults.processed,
          telesignValidated: validationResults.validated,
          lowRisk: validationResults.low_risk,
          csvFile: validationResults.download
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleDownload = async () => {
    try {

      if(!results.csvFile.downloadUrl) return

      setLoading(true);

      // Call your backend API — must return the file as a binary stream
      const response = await fetch(results.csvFile?.downloadUrl, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to download file");

      // Convert the response to a blob (binary data)
      const blob = await response.blob();

      // Create a temporary URL for the file
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = results.csvFile?.fileName || "validation_result.csv"; // specify filename
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back()
  }

  const cards = [
    { label: "Uploaded", value: results.uploaded, color: "bg-blue-400" },
    { label: "Sanitized", value: results.sanitized, color: "bg-blue-600" },
    { label: "Telesign Validated", value: results.telesignValidated, color: "bg-green-500" },
    { label: "Low Risk (High Validity)", value: results.lowRisk, color: "bg-yellow-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8" style={{background: "#dee2e1ff"}}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Validation Results</h1>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full max-w-5xl">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} shadow-md rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-100`}
          >
            <div
              className={`text-white text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-full ${card.color} mb-3`}
            >
              {card.value}
            </div>
            <p className="text-gray-600 font-medium text-white">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Download Results Button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
      >
        <Download className="w-5 h-5" />
        {loading ? "Downloading..." : "Download HubSpot-Ready CSV"}
      </button>

      <br />

      <button
        onClick={handleBack}
        className="flex items-center gap-2 bg-grey-600 px-6 py-3 rounded-lg shadow hover:bg-grey-700 transition text-black"
      >
         <ArrowLeft className="w-5 h-5" />
        Process Another File
      </button>
    </main>
  );
}
