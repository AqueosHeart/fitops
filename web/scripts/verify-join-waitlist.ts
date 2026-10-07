import { joinWaitlist } from "../lib/server/booking/join-waitlist";

async function main() {
  const result = await joinWaitlist("00000000-0000-4000-8000-000000000301", "00000000-0000-4000-8000-000000000023");
  if (result.code !== "ALREADY_WAITING") throw new Error(`Expected ALREADY_WAITING, received ${result.code}.`);
  console.log(result);
}

main();
