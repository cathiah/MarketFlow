import { handleLikeAction } from "~/lib/productReviews.server";
import type { Route } from "./+types/like";

export async function action({ request }: Route.ActionArgs) {
  return handleLikeAction(request);
}
