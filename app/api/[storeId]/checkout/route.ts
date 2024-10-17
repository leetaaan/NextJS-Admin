import { db } from "@/lib/firebase";
import { stripe } from "@/lib/stripe";
import { Products } from "@/types-db";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const { products, userId } = await req.json();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((item: Products) => {
    line_items.push({
      quantity: item.qty,
      price_data: {
        currency: "VND",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
    });
  });

  const orderData = {
    isPaid: false,
    orderItems: products,
    userId,
    order_status: "Đang xử lý",
    createdAt: serverTimestamp(),
  };

  const orderRef = await addDoc(
    collection(db, "stores", params.storeId, "orders"),
    orderData
  );

  const id = orderRef.id;

  await updateDoc(doc(db,"stores",params.storeId,"orders",id),{
    ...orderData,
    id,
    updatedAt: serverTimestamp()
  })
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "AU", "VN"],
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceld=1`,
    metadata: {
      orderId: id,
      storeId: params.storeId,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};
