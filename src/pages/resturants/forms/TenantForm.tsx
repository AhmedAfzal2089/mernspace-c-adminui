import { Col, Form, Input, Row } from "antd";

const TenantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Form.Item
          label="Restaurant Name"
          name="name"
          rules={[{ required: true, message: "Resturaunt Name Is Required" }]}
        >
          <Input size="large" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Restaurant Address"
          name="address"
          rules={[{ required: true, message: "Address Is Required" }]}
        >
          <Input size="large" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default TenantForm;
