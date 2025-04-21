import PropTypes from "prop-types";
import { Form, Row, Col } from "react-bootstrap";

const DateRangeFilter = ({ startDate, endDate, onChange }) => {
  return (
    <Row className="mb-3">
      <Col>
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          onChange={(e) => onChange("start", e.target.value)}
        />
      </Col>
      <Col>
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={endDate}
          onChange={(e) => onChange("end", e.target.value)}
        />
      </Col>
    </Row>
  );
};

DateRangeFilter.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default DateRangeFilter;
