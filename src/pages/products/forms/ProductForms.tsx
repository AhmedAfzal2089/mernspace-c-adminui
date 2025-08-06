import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Category, Tenant } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useState } from "react";

const ProductForms = () => {
  const selectedCateogry = Form.useWatch("categoryId");
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getTenants(`currentPage=1&perPage=100`).then((res) => res.data);
    },
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const uploaderConfig: UploadProps = {
    name: "file",
    showUploadList: false,
    multiple: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        messageApi.error("You can only Upload PNG/JPEG file format");
      }

      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Product Info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    { required: true, message: "Product Name Is Required" },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true, message: "Category Is Required" }]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={() => {}}
                    placeholder="Select Category"
                  >
                    {categories?.data.map((category: Category) => (
                      <Select.Option
                        value={JSON.stringify(category)}
                        key={category._id}
                      >
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Description Is Required" },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    style={{ resize: "none" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Product Image " variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label=""
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please Upload a Product Image",
                    },
                  ]}
                >
                  {contextHolder}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "50%" }}
                    />
                  ) : (
                    <Upload listType="picture-card" {...uploaderConfig} >
                      <Space direction="vertical">
                        <PlusOutlined />
                        <Typography.Text>Upload</Typography.Text>
                      </Space>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Tenant Info " variant="borderless">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[
                    { required: true, message: "Restaurant Is Required" },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={() => {}}
                    placeholder="Select Restaurant"
                  >
                    {restaurants?.data.map((tenant: Tenant) => (
                      <Select.Option value={tenant.id} key={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {selectedCateogry && <Pricing selectedCategory={selectedCateogry} />}
          {selectedCateogry && (
            <Attributes selectedCategory={selectedCateogry} />
          )}
          <Card title="Other Properties " variant="borderless">
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item name="isPublish">
                    <Switch
                      defaultChecked={false}
                      onChange={() => {}}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 22, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForms;
