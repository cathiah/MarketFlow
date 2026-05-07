import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import type { PaymentPayload } from "./types";
import { performDeleteOrder } from "./deleteOrder.server";
import { performPayOrder } from "./payOrder.server";
import { performGetBuyerOrders } from "./getBuyerOrders.server";

export async function performOrderAction(request: Request) {
  const formData = await request.formData();
  const actionType = formData.get("action") as string;
  const orderId = formData.get("orderId") as string;

  if (!orderId) {
    const { headers } = createClient(request);
    return data({ error: "ID de commande manquant" }, { headers });
  }

  try {
    if (actionType === "delete") {
      await performDeleteOrder(request, orderId);
    } else if (actionType === "pay") {
      const paymentData: PaymentPayload = {
        payment_method: (formData.get("payment_method") as string) || "card",
        card_number: (formData.get("card_number") as string) || "",
        expiry_date: (formData.get("expiry_date") as string) || "",
        cardholder_name: (formData.get("cardholder_name") as string) || "",
        shipping_address:
          (formData.get("shipping_address") as string) || undefined,
      };
      await performPayOrder(request, orderId, paymentData);
    } else {
      const { headers } = createClient(request);
      return data({ error: "Action non reconnue" }, { headers });
    }

    return await performGetBuyerOrders(request);
  } catch (error: any) {
    const { headers } = createClient(request);
    return data(
      { error: error.message || "Erreur lors de l'opération" },
      { headers }
    );
  }
}
