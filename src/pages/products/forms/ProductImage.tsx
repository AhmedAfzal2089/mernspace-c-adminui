import { Form, message, Space, Typography, Upload, UploadProps } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = () => {
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
      <Upload listType="picture-card" {...uploaderConfig}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "50%" }} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
