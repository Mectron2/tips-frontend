import { BillsCards } from "./BillsCards.tsx";
import React, { useEffect, useState } from "react";
import type { Bill } from "./types.tsx";

type HolderProps = {
    bills?: Bill[];
    title?: string;
    emptyMessage?: string;
    currency?: string;
    className?: string;
};

export const BillsCardsContainer: React.FC<HolderProps> = ({ title = "Bills", emptyMessage = "There are no bills", currency = "USD" }) => {
    const [billsArray, setBillsArray] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        amount: "",
        tipPercent: ""
    });

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = () => {
        setLoading(true);
        fetch("http://localhost:3000/bills")
            .then((response) => response.json())
            .then((json) => setBillsArray(json))
            .catch((err) => console.error("Error loading bills:", err))
            .finally(() => setLoading(false));
    };

    const handleCreateBill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.tipPercent) return;

        setCreating(true);
        try {
            const response = await fetch("http://localhost:3000/bills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    tipPercent: parseFloat(formData.tipPercent) / 100,
                }),
            });

            if (response.ok) {
                setFormData({ amount: "", tipPercent: "" });
                setShowCreateForm(false);
                loadBills();
            } else {
                console.error("Failed to create bill");
            }
        } catch (err) {
            console.error("Error creating bill:", err);
        } finally {
            setCreating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        loading ? <div className="text-center p-6">Loading...</div> :
            <section className={`max-w-3xl mx-auto p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-500">Total: {Array.isArray(billsArray) ? billsArray.length : 0}</div>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {showCreateForm ? "Cancel" : "New Bill"}
                        </button>
                    </div>
                </div>

                {showCreateForm && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Create New Bill</h3>
                        <form onSubmit={handleCreateBill} className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Amount ({currency})
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label htmlFor="tipPercent" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Tip Percentage (%)
                                </label>
                                <input
                                    type="number"
                                    id="tipPercent"
                                    name="tipPercent"
                                    value={formData.tipPercent}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                    placeholder="15"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={creating || !formData.amount || !formData.tipPercent}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    {creating ? "Creating..." : "Create Bill"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setFormData({ amount: "", tipPercent: "" });
                                    }}
                                    className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {Array.isArray(billsArray) && billsArray.length > 0 ? (
                    <BillsCards bills={billsArray} currency={currency} />
                ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-slate-500">{emptyMessage}</div>
                )}
            </section>
    );
};

export default BillsCardsContainer;