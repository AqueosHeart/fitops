import { joinWaitlist } from "../lib/server/booking/join-waitlist";

async function main() {
  const result = await joinWaitlist("00000000-0000-4000-8000-000000000301", "00000000-0000-4000-8000-000000000023");
  if (result.code !== "ALREADY_PARTICIPATING") throw new Error(`Expected ALREADY_PARTICIPATING, received ${result.code}.`);
  console.log(result);
}

main();
