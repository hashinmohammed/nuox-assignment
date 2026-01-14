import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validatePaymentAmount } from "@/utils/validators";

// POST /api/installments/[id]/payment - Record payment for installment
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { amount, paymentDate } = body;

    // Get installment
    const installment = db.installments.getById(id);
    if (!installment) {
      return NextResponse.json(
        { error: "Installment not found" },
        { status: 404 }
      );
    }

    // Validate payment amount
    const validation = validatePaymentAmount(amount, installment.balanceAmount);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Update installment
    const newPaidAmount = installment.paidAmount + amount;
    const updatedInstallment = db.installments.update(id, {
      paidAmount: newPaidAmount,
      paidDate: paymentDate || new Date().toISOString(),
    });

    // Create payment record
    const payment = db.payments.create({
      installmentId: id,
      amount,
      paymentDate: paymentDate || new Date().toISOString(),
    });

    return NextResponse.json(
      { installment: updatedInstallment, payment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
