import {
  Card,
  Layout,
  Space,
  Form,
  Input,
  Checkbox,
  Button,
  Flex,
  Alert,
} from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";
import { useMutation } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { login } from "../../http/api";

const loginUser = async (credentials: Credentials) => {
  // this userData is coming from mutate which is called in form success
  //server call logic
  const { data } = await login(credentials); // axios return a object named data which have all the things which your server is returning
  return data;
};

const LoginPage = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      console.log("Login Successfully");
    },
  });

  return (
    <>
      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space direction="vertical" align="center" size="large">
          <Layout.Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />
          </Layout.Content>
          <Card
            variant="borderless"
            style={{ width: 300 }}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 16,
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign in
              </Space>
            }
          >
            <Form
              initialValues={{
                remember: true,
              }}
              onFinish={(values) => {
                //values give the form data on submit then we pass them to mutate then it is transferred to its function
                mutate({ email: values.username, password: values.password });
                console.log(values);
              }}
            >
              {isError && (
                <Alert
                  style={{ marginBottom: 24 }}
                  type="error"
                  message={error?.message}
                />
              )}
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please Input Your Username",
                  },
                  { type: "email", message: "Email is not Valid" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="" id="login-form-forgot">
                  Forgot password
                </a>
              </Flex>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100% " }}
                  loading={isPending}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
