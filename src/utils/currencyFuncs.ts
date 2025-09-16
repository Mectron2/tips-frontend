export function formatCurrency(value: number, currency = "EUR") {
    if (!isFinite(value)) return "—";
    return new Intl.NumberFormat("ua-UA", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatPercent(p: number) {
    if (!isFinite(p)) return "—";
    return `${(p * 100).toFixed(0)}%`;
}

export function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}