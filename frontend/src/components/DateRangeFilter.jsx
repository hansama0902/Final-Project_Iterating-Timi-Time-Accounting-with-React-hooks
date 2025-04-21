// DateRangeFilter.jsx
import PropTypes from "prop-types";
import { Form, Row, Col, Card } from "react-bootstrap";
import "../stylesheets/DateRangeFilter.css";

const DateRangeFilter = ({ startDate, endDate, onChange }) => {
  return (
    <Card className="date-filter-card">
      <Card.Body>
        <h3 className="date-filter-title">Date Range</h3>
        <Row>
          <Col md={6}>
            <Form.Group className="date-input-group">
              <Form.Label htmlFor="start-date" className="date-label">
                Start Date
              </Form.Label>
              <Form.Control
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => onChange("start", e.target.value)}
                className="date-input"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="date-input-group">
              <Form.Label htmlFor="end-date" className="date-label">
                End Date
              </Form.Label>
              <Form.Control
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => onChange("end", e.target.value)}
                className="date-input"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

DateRangeFilter.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default DateRangeFilter;
