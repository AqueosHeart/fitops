import { TrainerSessions } from "@/components/trainer-workspace";
import { TrainerPageGuard } from "@/components/trainer-page-guard";

export default function TrainerSessionsPage() {
  return <TrainerPageGuard returnTo="/trainer/sessions"><TrainerSessions /></TrainerPageGuard>;
}
