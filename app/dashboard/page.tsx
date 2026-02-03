"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------------- Constants ---------------- */

const WEEK_OPTIONS = [
  { label: "1st Week", value: "week1" },
  { label: "2nd Week", value: "week2" },
  { label: "3rd Week", value: "week3" },
  { label: "4th Week", value: "week4" },
];

// Static mock data (replace with Supabase RPC later)
const MOCK_DATA: Record<string, any> = {
  week1: { uploads: 0, validations: 0, existing: 0 },
  week2: { uploads: 0, validations: 0, existing: 0 },
  week3: { uploads: 10211, validations: 9836, existing: 375 },
  week4: { uploads: 0, validations: 0, existing: 0 },
};

const CREDITS_DATA = {
  hasEnoughCredits:true, 
  consumed:{
    standard:0,withLive:0
  },
  remaining:{
    standard:0,withLive:0
  },
  cap:{
    standardMax:0,withLiveMax:0
  }
}

/* ---------------- Page ---------------- */

export default function TelesignDashboardPage() {

  const [week, setWeek] = useState("week1");
  const [credits, setCredits] = useState(CREDITS_DATA);
  const [contacts, setContacts] = useState(0);

  const [phoneIdTrans, setPhoneIdTrans] = useState(0);
  const [phoneIdLiveTrans, setPhoneIdLiveTrans] = useState(0);

  const [phoneIdRate, setPhoneIdRate] = useState(0.0055);
  const [phoneIdLiveRate, setPhoneIdLiveRate] = useState(0.0065);

  const metrics = MOCK_DATA[week];

  // 🔹 Derived transactions (2 per contact)
  // const phoneIdTx = contacts;
  // const phoneIdLiveTx = contacts;

  // const phoneIdTotal = phoneIdTx * phoneIdRate;
  // const phoneIdLiveTotal = phoneIdLiveTx * phoneIdLiveRate;

  // const grandTotal = useMemo(
  //   () => phoneIdTotal + phoneIdLiveTotal,
  //   [phoneIdTotal, phoneIdLiveTotal]
  // );

  // Total billing
  const phoneIdTotal = phoneIdTrans * phoneIdRate;
  const phoneIdLiveTotal = phoneIdLiveTrans * phoneIdLiveRate;
  const grandTotal = phoneIdTotal + phoneIdLiveTotal;

  useEffect(() => {
    const fetchCredits = async () => {
      const res = await fetch("/api/credits");
      const data = await res.json();
      setCredits(data);
    }
    fetchCredits();
  }, [])

  return (
    <div className="bg-white text-gray-800">
      <div className="p-8 max-w-7xl mx-auto bg-white" style={{ width: '100%' }}>
        <h1 className="text-3xl font-bold mb-8">
          📊 Telesign API Transactions Dashboard
        </h1>

        <div className="mt-10 mb-20">
          <div className="flex justify-start">
            <div className="text-left space-y-2 flex-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Credits Remaining:
              </p>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">Standard</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.remaining?.standard || ''} / {credits && credits?.cap?.standardMax || ''}
                </span>
              </div>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">With Live ID</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.remaining?.withLive || ''} / {credits && credits?.cap?.withLiveMax || ''}
                </span>
              </div>

            </div>
            <div className="flex-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Credits Used:
              </p>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">Standard</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.consumed?.standard || ''} / {credits && credits?.cap?.standardMax || ''}
                </span>
              </div>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">With Live ID</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.consumed?.withLive || 0} / {credits && credits?.cap?.withLiveMax || ''}
                </span>
              </div>
            </div>

            <div className="flex-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Billing:
              </p>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">Standard</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.consumed?.standard || ''} = ${credits && credits?.consumed?.standard * phoneIdRate}
                </span>
              </div>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">With Live ID</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.consumed?.withLive || 0} = ${credits && credits?.consumed?.withLive * phoneIdLiveRate}
                </span>
              </div>
            </div>

            <div className="flex-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Hard Cap:
              </p>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">Standard</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.cap?.standardMax || ''}
                </span>
                -
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  ${Math.round(credits && credits?.cap?.standardMax * phoneIdRate)}
                </span>
              </div>

              <div className="flex items-center justify-start gap-2">
                <span className="text-sm">With Live ID</span>
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  {credits && credits?.cap?.withLiveMax || ''}
                </span>
                -
                <span className="badge bg-gray-100 text-black px-2 py-1 rounded-md">
                  ${Math.round(credits && credits?.cap?.withLiveMax * phoneIdLiveRate)}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---------------- LEFT: DASHBOARD ---------------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Week Filter */}
            <div className="flex gap-3">
              {WEEK_OPTIONS.map(w => (
                <button
                  key={w.value}
                  onClick={() => setWeek(w.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${week === w.value
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-50"
                    }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title=" Total Uploaded Contacts"
                value={metrics.uploads}
              />
              <MetricCard
                title=" Total Validations"
                value={metrics.validations.toLocaleString()}
              />
              <MetricCard
                title=" Existing Contacts"
                value={metrics.existing.toLocaleString()}
              />
            </div>
          </div>

          {/* ---------------- RIGHT: CALCULATOR ---------------- */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold">
              Transaction Billing Calculator
            </h2>

            <div className="space-y-4">
              <CalculatorInput
                label="Number of Contacts"
                value={contacts}
                onChange={(value: any) => {
                  setContacts(value);
                  setPhoneIdTrans(value);
                  setPhoneIdLiveTrans(value);
                }}
              />
              <CalculatorInput
                label="Phone ID Transactions"
                value={phoneIdTrans}
                onChange={(value: any) => {
                  setPhoneIdTrans(value);
                  setPhoneIdLiveTrans(value); // sync live transactions
                  setContacts(value); // update contacts sum
                }}
              />
              <CalculatorInput
                label="Phone ID Live Transactions"
                value={phoneIdLiveTrans}
                onChange={setPhoneIdLiveTrans}
                disabled={true}
              />
              <CalculatorInput
                label="Phone ID Rate ($ - US - Mobile)"
                value={phoneIdRate}
                onChange={setPhoneIdRate}
                step="0.01"
              />
              <CalculatorInput
                label="Phone ID Live Rate ($ - US)"
                value={phoneIdLiveRate}
                onChange={setPhoneIdLiveRate}
                step="0.01"
              />
            </div>

            {/* Billing Breakdown */}
            <div className="bg-white p-4 rounded-xl border space-y-2">
              <h3 className="text-lg font-semibold"> Total Billing</h3>

              <div className="flex justify-between text-sm">
                <span>Phone ID</span>
                <span>${phoneIdTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Phone ID Live</span>
                <span>${phoneIdLiveTotal.toFixed(2)}</span>
              </div>

              <div className="border-t pt-2 flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span className="text-green-600">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function MetricCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2 text-gray-500">{value}</p>
    </div>
  );
}

function CalculatorInput({
  label,
  value,
  onChange,
  step = "1",
  disabled = false,
}: any) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={e => onChange?.(Number(e.target.value))}
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}
