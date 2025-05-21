import Image from "next/image";

const PaymentPlanSection = ({ paymentPlans }) => {
  console.log("ss");
  if (!paymentPlans?.length) return null;

  return (
    <div className="content">
      <h3 className="title">Payment Plan</h3>

      {paymentPlans.map((plan) => (
        <div key={plan._id} className="payment_plan_row">
          {plan.steps.map((step, index) => (
            <div key={index} className="block">
              <div className="icon">
                <Image
                  src={
                    index === 0
                      ? "/assets/images/down-payment.png"
                      : index === 1
                        ? "/assets/images/under-construction.png"
                        : "/assets/images/hand-over.png"
                  }
                  width={40}
                  height={40}
                  alt="icon"
                />
              </div>
              <h4 className="percent">{step.percentage}%</h4>
              <div className="name">{step.title}</div>
              <div className="time">{step.subtitle}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PaymentPlanSection;
