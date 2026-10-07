import { jsonData } from "@/lib/server/http/response";

const plans = [
  { code: "base", name: "Base", demoOnly: true, paymentCollected: false },
  { code: "complete", name: "Complete", demoOnly: true, paymentCollected: false },
  { code: "training_plus", name: "Training Plus", demoOnly: true, paymentCollected: false },
];

export function GET() {
  return jsonData({ plans, notice: "Fictional demo plans only. No payment is collected." });
}
