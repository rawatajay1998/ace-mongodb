"use client";

import { useState } from "react";
import {
  InputNumber,
  Slider,
  Row,
  Col,
  Divider,
  Typography,
  Progress,
} from "antd";

const { Text } = Typography;

function formatNumber(num: number) {
  return num.toLocaleString();
}

export default function MortgageCalculator() {
  const [totalPrice, setTotalPrice] = useState(629504);
  const [loanPeriod, setLoanPeriod] = useState(25);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [interestRate, setInterestRate] = useState(4);

  const downPaymentAmount = (totalPrice * downPaymentPercent) / 100;
  const loanAmount = totalPrice - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanPeriod * 12;

  const monthlyPayment =
    loanAmount === 0
      ? 0
      : (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  const interestPercent = totalPayment ? totalInterest / totalPayment : 0;
  const principalPercent = 1 - interestPercent;

  return (
    <div>
      <Text
        style={{
          fontSize: 16,
          color: "#555",
          marginBottom: 32,
          display: "block",
          maxWidth: 400,
        }}
      >
        Calculate and view the monthly mortgage for your property with ease.
      </Text>

      <Row gutter={[48, 48]}>
        <Col
          xs={24}
          md={14}
          style={{
            paddingRight: 24,
          }}
        >
          {/* Total Price */}
          <div style={{ marginBottom: 36 }}>
            <Text
              strong
              style={{
                fontSize: 16,
                color: "#222",
                display: "block",
                marginBottom: 12,
              }}
            >
              Total Price
            </Text>
            <Row gutter={12} align="middle">
              <Col flex="auto">
                <InputNumber
                  min={0}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1.5px solid #d9d9d9",
                    padding: "8px 12px",
                    fontSize: 16,
                    transition: "border-color 0.3s",
                  }}
                  value={totalPrice}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0
                  }
                  onChange={(val) => setTotalPrice(val ?? 0)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#40a9ff")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d9d9d9")
                  }
                />
              </Col>
              <Col>
                <Text style={{ fontSize: 16, color: "#888" }}>AED</Text>
              </Col>
            </Row>
            <Slider
              min={10000}
              max={5000000}
              step={1000}
              value={totalPrice}
              onChange={(val) => setTotalPrice(val ?? 10000)}
              style={{ marginTop: 16, borderRadius: 8 }}
            />
          </div>

          {/* Loan Period */}
          <div style={{ marginBottom: 36 }}>
            <Text
              strong
              style={{
                fontSize: 16,
                color: "#222",
                display: "block",
                marginBottom: 12,
              }}
            >
              Loan Period
            </Text>
            <Row gutter={12} align="middle">
              <Col flex="auto">
                <InputNumber
                  min={1}
                  max={40}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1.5px solid #d9d9d9",
                    padding: "8px 12px",
                    fontSize: 16,
                    transition: "border-color 0.3s",
                  }}
                  value={loanPeriod}
                  onChange={(val) => setLoanPeriod(val ?? 1)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#40a9ff")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d9d9d9")
                  }
                />
              </Col>
              <Col>
                <Text style={{ fontSize: 16, color: "#888" }}>Years</Text>
              </Col>
            </Row>
            <Slider
              min={1}
              max={40}
              value={loanPeriod}
              onChange={(val) => setLoanPeriod(val ?? 1)}
              style={{ marginTop: 16, borderRadius: 8 }}
            />
          </div>

          {/* Down Payment */}
          <div style={{ marginBottom: 36 }}>
            <Text
              strong
              style={{
                fontSize: 16,
                color: "#222",
                display: "block",
                marginBottom: 12,
              }}
            >
              Down Payment
            </Text>
            <Row gutter={12} align="middle">
              <Col flex="auto">
                <InputNumber
                  min={0}
                  max={totalPrice}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1.5px solid #d9d9d9",
                    padding: "8px 12px",
                    fontSize: 16,
                    transition: "border-color 0.3s",
                  }}
                  value={downPaymentAmount}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0
                  }
                  onChange={(val) => {
                    if (
                      val !== undefined &&
                      val !== null &&
                      val >= 0 &&
                      val <= totalPrice
                    ) {
                      setDownPaymentPercent((val / totalPrice) * 100);
                    }
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#40a9ff")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d9d9d9")
                  }
                />
              </Col>
              <Col>
                <Text style={{ fontSize: 16, color: "#888" }}>AED</Text>
              </Col>
              <Col style={{ width: 72 }}>
                <InputNumber
                  min={0}
                  max={100}
                  value={Math.round(downPaymentPercent)}
                  formatter={(val) => `${val}%`}
                  parser={(val) => (val ? Number(val.replace("%", "")) : 0)}
                  onChange={(val) => {
                    if (
                      val !== undefined &&
                      val !== null &&
                      val >= 0 &&
                      val <= 100
                    ) {
                      setDownPaymentPercent(val);
                    }
                  }}
                  style={{
                    borderRadius: 8,
                    border: "1.5px solid #d9d9d9",
                    padding: "8px 12px",
                    fontSize: 16,
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#40a9ff")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d9d9d9")
                  }
                />
              </Col>
            </Row>
            <Slider
              min={0}
              max={100}
              value={downPaymentPercent}
              onChange={(val) => setDownPaymentPercent(val ?? 0)}
              style={{ marginTop: 16, borderRadius: 8 }}
            />
          </div>

          {/* Interest Rate */}
          <div>
            <Text
              strong
              style={{
                fontSize: 16,
                color: "#222",
                display: "block",
                marginBottom: 12,
              }}
            >
              Interest Rate
            </Text>
            <Row gutter={12} align="middle">
              <Col flex="auto">
                <InputNumber
                  min={0}
                  max={20}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1.5px solid #d9d9d9",
                    padding: "8px 12px",
                    fontSize: 16,
                    transition: "border-color 0.3s",
                  }}
                  value={interestRate}
                  formatter={(val) => `${val}%`}
                  parser={(val) => (val ? Number(val.replace("%", "")) : 0)}
                  onChange={(val) => setInterestRate(val ?? 0)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#40a9ff")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d9d9d9")
                  }
                />
              </Col>
              <Col>
                <Text style={{ fontSize: 16, color: "#888" }}>%</Text>
              </Col>
            </Row>
            <Slider
              min={0}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(val) => setInterestRate(val ?? 0)}
              style={{ marginTop: 16, borderRadius: 8 }}
            />
          </div>
        </Col>

        <Col
          xs={24}
          md={10}
          style={{
            paddingLeft: 24,
            marginTop: 24,
          }}
        >
          <div
            style={{
              backgroundColor: "#f5faff",
              padding: 32,
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(64, 169, 255, 0.15)",
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text
              strong
              style={{ fontSize: 32, color: "#096dd9", marginBottom: 4 }}
            >
              AED {formatNumber(Math.round(monthlyPayment))}
            </Text>
            <Text type="secondary" style={{ fontSize: 16, marginBottom: 24 }}>
              per month
            </Text>

            <Divider />

            <Text
              type="secondary"
              style={{ fontWeight: "bold", marginBottom: 6, fontSize: 14 }}
            >
              TOTAL LOAN AMOUNT
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#096dd9",
                marginBottom: 32,
              }}
            >
              AED {formatNumber(Math.round(loanAmount))}
            </Text>

            <Text
              type="secondary"
              style={{ fontWeight: "bold", marginBottom: 12, fontSize: 14 }}
            >
              PAYMENT BREAKDOWN
            </Text>

            <Progress
              percent={Math.round(principalPercent * 100)}
              success={{
                percent: Math.round(interestPercent * 100),
              }}
              showInfo={false}
              strokeColor="#096dd9"
              trailColor="#d6e4ff"
              size={12}
              style={{ borderRadius: 8 }}
            />

            <Row
              justify="space-between"
              style={{
                marginTop: 16,
                fontWeight: "600",
                fontSize: 14,
                color: "#555",
              }}
            >
              <Text>Principal</Text>
              <Text>Interest</Text>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}
