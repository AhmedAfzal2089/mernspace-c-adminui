import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";
import { FieldData, Product } from "../../types";
import { useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts } from "../../http/api";
import { format } from "date-fns";
import { debounce } from "lodash";
import { PER_PAGE } from "../../constants";
import { useAuthStore } from "../../store";
import ProductForms from "./forms/ProductForms";
import { makeFormData } from "./helpers";
const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <Space>
          <Image width={60} src={record.image} preview={false} />
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_: boolean, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
];
const Products = () => {
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
  });
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    // if any of the key changes it again refetches the users
    queryKey: ["products", queryParams],
    queryFn: () => {
      // this will omit the falsy values
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData, // this is fixing ui jumping issue
  });

  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);
  const onFilterChange = (changedFields: FieldData[]) => {
    // the data is coming in an array , so converting it into the object as key value pair
    const changedFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        page: 1,
      }));
    }
    console.log("changed Fields", changedFilterFields);
  };
  const {
    token: { colorBgLayout },
  } = theme.useToken(); // theme coming from main.tsx
  const [DrawerOpen, setDrawerOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) =>
      createProduct(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });
  const onHandleSubmit = async () => {
    // const dummy = {
    //   Size: {
    //     priceType: "base",
    //     availableOptions: { Small: 400, Medium: 600, Large: 800 },
    //   },
    //   Crust: {
    //     priceType: "aditional",
    //     availableOptions: { Thin: 50, Thick: 100 },
    //   },
    // };
    await form.validateFields();
    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {} // for initial value in reduce method
    );
    console.log("submitting");
    const categoryId = JSON.parse(form.getFieldValue("categoryId"))._id;
    // const attrs = [
    //   { name: "Is Hit", value: true },
    //   { name: "Spiciness", value: "Hot" },
    // ];
    //     const currentAttrs = {
    //     "isHit": "No",
    //     "Spiciness": "Less"
    // }
    // we need to convert this into array so using map , so it will return a array
    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          valur: value,
        };
      }
    );

    const postData = {
      ...form.getFieldsValue(),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      image: form.getFieldValue("image"),
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };
    // this is a simple object , but we need to send multipart form data, so have to convert it
    const formData = makeFormData(postData);
    await productMutate(formData);
  };
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: () => {
                return (
                  <Space>
                    <Button type="link" onClick={() => {}}>
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page) => {
              console.log(page);
              //changing state by function bcz we need previous data in this
              setQueryParams((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
        <Drawer
          title={"Add Product"}
          width={720}
          styles={{ body: { background: colorBgLayout } }}
          open={DrawerOpen}
          destroyOnHidden={true}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={onHandleSubmit}
                loading={isCreateLoading}
              >
                Submit
              </Button>
            </Space>
          }
        >
          {/* // on submission we want data here so wrapping it on parent component */}
          {/* form={form} is coming from the above component */}
          <Form layout="vertical" form={form}>
            <ProductForms />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
