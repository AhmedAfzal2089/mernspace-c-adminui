import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
  const { data: tenant } = useQuery({
    queryKey: ["tenant"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic Info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First Name" name="firstName">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="First Name" name="firstName">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Security Info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Password" name="password">
                  <Input type="password" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Role" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={() => {}}
                    placeholder="Select Role"
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="user">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Restaurant" name="tenantId">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={() => {}}
                    placeholder="Select Restaurant"
                  >
                    {tenant?.map((tenant: Tenant) => (
                      <Select.Option value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
