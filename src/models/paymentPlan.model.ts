import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentStep {
  percentage: number;
  title: string;
  subtitle: string;
  iconUrl?: string;
}

export interface IPaymentPlan extends Document {
  propertyId: mongoose.Types.ObjectId;
  steps: IPaymentStep[];
}

const stepSchema = new Schema<IPaymentStep>(
  {
    percentage: Number,
    title: String,
    subtitle: String,
    iconUrl: String,
  },
  { _id: false }
);

const paymentPlanSchema = new Schema<IPaymentPlan>({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
    unique: true,
  },
  steps: [stepSchema],
});

export default mongoose.models.PaymentPlan ||
  mongoose.model<IPaymentPlan>("PaymentPlan", paymentPlanSchema);
