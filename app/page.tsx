import ValidationForm from "./components/ValidationForm.jsx";

export default function Home() {

  const accessibility = process.env.APPLICATION_STATUS || 'disabled';

  if (accessibility !== 'enabled') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={{width: '100%', background: "#dee2e1ff"}}>
        <p className="text-xl font-bold text-orange-400">Application is currently disabled.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={{width: '100%', background: "#dee2e1ff"}}>
      <ValidationForm />
    </main>
  );
}
