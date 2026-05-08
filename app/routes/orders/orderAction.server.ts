import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { performDeleteOrder } from "./deleteOrder.server";
import { performPayOrder, type PaymentPayload } from "./payOrder.server";
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
      const provider = (formData.get("provider") as string) || "card";
      
      // Build payment_details based on provider
      const payment_details: Record<string, string | number | boolean> = {};
      
      if (provider === "card") {
        // For card payments, extract card info
        const cardNumber = (formData.get("card_number") as string) || "";
        payment_details.card_brand = (formData.get("card_brand") as string) || "Unknown";
        payment_details.last_4 = cardNumber.replace(/\s/g, "").slice(-4);
        payment_details.cardholder_name = (formData.get("cardholder_name") as string) || "";
      } else if (provider === "paypal") {
        // For PayPal payments, extract email
        payment_details.email = (formData.get("paypal_email") as string) || "";
      }
      
      const paymentData: PaymentPayload = {
        provider: provider as 'stripe' | 'paypal' | 'card',
        payment_details,
        external_id: (formData.get("external_id") as string) || undefined,
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
