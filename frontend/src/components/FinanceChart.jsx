// FinanceChart.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Button, Row, Col, Card } from "react-bootstrap";
import "../stylesheets/FinanceChart.css";

const aggregateByCategory = (transactions) => {
  const summary = {};

  for (const t of transactions) {
    if (!summary[t.category]) {
      summary[t.category] = 0;
    }
    summary[t.category] += Number(t.amount);
  }

  return Object.entries(summary)
    .map(([category, amount]) => ({
      category,
      amount,
      value: amount, // 'value' is required by Recharts for PieChart
    }))
    .sort((a, b) => b.amount - a.amount); // Sort by amount descending
};

const FinanceChart = ({ data }) => {
  const [chartType, setChartType] = useState("income");

  const filteredData = data.filter((t) => t.type === chartType);
  const aggregatedData = aggregateByCategory(filteredData);
  
  // Calculate total for percentage display
  const total = aggregatedData.reduce((sum, item) => sum + item.amount, 0);

  // Generate colors dynamically based on category
  const getColorByIndex = (index) => {
    const baseColors = chartType === "income" 
      ? ['#28a745', '#40b95f', '#57ca78', '#6ed992', '#86e8ac', '#9df7c6']  // Green shades
      : ['#dc3545', '#e14b59', '#e6626d', '#eb7882', '#f08e96', '#f5a5ab']; // Red shades
      
    return baseColors[index % baseColors.length];
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent}) => {
    if (percent < 0.05) return null; // Don't render labels for small slices
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="pie-chart-label"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="finance-chart-container">
      <Card.Body>
        <div className="finance-chart-header">
          <h2 className="finance-chart-title">
            {chartType === "income" ? "Income" : "Expense"} Breakdown
          </h2>
          
          <div className="finance-chart-controls">
            <Button
              variant={chartType === "income" ? "success" : "outline-success"}
              onClick={() => setChartType("income")}
              className="chart-toggle-btn"
            >
              Income
            </Button>
            <Button
              variant={chartType === "expense" ? "danger" : "outline-danger"}
              onClick={() => setChartType("expense")}
              className="chart-toggle-btn"
            >
              Expenses
            </Button>
          </div>
        </div>

        {aggregatedData.length === 0 ? (
          <div className="no-data-message">
            <p>No {chartType} transactions to display</p>
            <small>Add {chartType} transactions to see a breakdown by category</small>
          </div>
        ) : (
          <Row>
            <Col lg={8} className="chart-col">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={aggregatedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {aggregatedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorByIndex(index)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                    labelFormatter={(name) => `Category: ${name}`}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Col>
            
            <Col lg={4} className="summary-col">
              <div className="chart-summary">
                <h3 className="summary-title">Summary</h3>
                <div className="summary-total">
                  <span className="total-label">Total {chartType}:</span>
                  <span className="total-value">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <div className="category-breakdown">
                  <h4 className="breakdown-title">Top Categories</h4>
                  <ul className="category-list">
                    {aggregatedData.slice(0, 5).map((item, index) => (
                      <li key={index} className="category-item">
                        <div className="category-info">
                          <span 
                            className="category-color" 
                            style={{ backgroundColor: getColorByIndex(index) }}
                          ></span>
                          <span className="category-name">{item.category}</span>
                        </div>
                        <span className="category-amount">
                          ${item.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {aggregatedData.length > 5 && (
                    <div className="more-categories">
                      And {aggregatedData.length - 5} more categories
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

FinanceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      type: PropTypes.oneOf(["income", "expense"]).isRequired,
    }),
  ).isRequired,
};

export default FinanceChart;
