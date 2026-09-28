import { bookSession } from "../lib/server/booking/book-session";

async function main() {
  const result = await bookSession(
    "00000000-0000-4000-8000-000000000301",
    "00000000-0000-4000-8000-000000000021",
  );

  if (result.code !== "ALREADY_BOOKED") {
    throw new Error(`Expected ALREADY_BOOKED, received ${result.code}.`);
  }

  console.log(result);
}

main();
