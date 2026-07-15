const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const wholeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** @type {Intl.DateTimeFormatOptions} */
const shortDateOptions = { month: "short", day: "numeric" };

/** @param {string} value */
function parseDateOnly(value) {
  return new Date(`${value}T12:00:00`);
}

/** @param {number | null | undefined} value */
export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

/** @param {number | null | undefined} value */
export function formatWholeCurrency(value) {
  return wholeCurrencyFormatter.format(value || 0);
}

/**
 * @param {string} value
 * @param {{ weekday?: boolean }} [options]
 */
export function formatRelativeDate(value, { weekday = false } = {}) {
  if (!value) return "";
  const date = parseDateOnly(value);
  const diff = Math.ceil((date.getTime() - Date.now()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    ...(weekday ? { weekday: "short" } : {}),
    ...shortDateOptions,
  });
}

/**
 * @param {string | null | undefined} start
 * @param {string | null | undefined} end
 */
export function formatDateRange(start, end) {
  if (!start || !end) return "";
  const startLabel = parseDateOnly(start).toLocaleDateString(
    "en-US",
    shortDateOptions
  );
  const endLabel = parseDateOnly(end).toLocaleDateString(
    "en-US",
    shortDateOptions
  );
  return `${startLabel} – ${endLabel}`;
}

/** @param {string} start */
export function formatWeekRange(start) {
  const startDate = parseDateOnly(start);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return `${startDate.toLocaleDateString(
    "en-US",
    shortDateOptions
  )} – ${endDate.toLocaleDateString("en-US", shortDateOptions)}`;
}

/**
 * @typedef {object} Payment
 * @property {string} [type]
 * @property {boolean} [isEstimate]
 * @property {string} [status]
 * @property {number} [renewalCount]
 */

/** @param {Payment | null | undefined} payment */
export function getPaymentToneClass(payment) {
  /** @type {Record<string, string>} */
  const toneClasses = {
    hourly: "text-blue-600",
    salary: "text-emerald-600",
    freelance: "text-orange-600",
    business: "text-violet-600",
    stripe_subscription_renewal: "text-emerald-600",
    stripe_payout: "text-sky-600",
    stripe_pending: "text-amber-600",
  };
  const paymentType = payment?.type;

  return (
    (paymentType ? toneClasses[paymentType] : undefined) ??
    (payment?.isEstimate ? "text-amber-600" : "text-gray-900")
  );
}

/**
 * @param {Payment | null | undefined} payment
 * @param {{ describeEstimatedRenewals?: boolean }} [options]
 */
export function getPaymentKindLabel(
  payment,
  { describeEstimatedRenewals = false } = {}
) {
  switch (payment?.type) {
    case "hourly":
    case "salary":
    case "freelance":
      return "job pay";
    case "business":
      return "business payment";
    case "stripe_subscription_renewal":
      if (describeEstimatedRenewals) {
        return payment?.renewalCount
          ? `est. payout · ${payment.renewalCount} renewal${
              payment.renewalCount > 1 ? "s" : ""
            }`
          : "est. payout";
      }
      return "subscription renewal";
    case "stripe_payout":
      return payment?.status
        ? `stripe payout · ${payment.status}`
        : "stripe payout";
    case "stripe_pending":
      return "pending stripe balance";
    default:
      return (
        payment?.status || (payment?.isEstimate ? "estimated" : "scheduled")
      );
  }
}

/** @param {string} base64String */
export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
