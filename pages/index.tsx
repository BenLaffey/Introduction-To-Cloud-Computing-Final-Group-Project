
import { Inter } from 'next/font/google'
import {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag} from "antd";
import { faker } from '@faker-js/faker';
import {User} from ".prisma/client";
import {Order} from ".prisma/client";
const inter = Inter({ subsets: ['latin'] })

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log(values);
    const bill = values.bill.toFixed(2);
    values.bill = '$' + bill;
    setIsModalOpen(false);
    fetch('/api/create_user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }).then(async response => {
      if (response.status === 200) {
        const user = await response.json();
        message.success('created customer ' + user.name);
        setUsers([...users, user]);

      } else message.error(
          `Failed to create customer:\n ${JSON.stringify(await response.json())}\nCustomers cannot sit in the same seat`);
    }).catch(res=>{message.error(res)})
  };
  
  const onFinish2 = async (values: any) => {
    console.log(values);
    const price = values.price.toFixed(2);
    values.price = '$' + price;
    setIsModalOpen2(false);
    fetch('/api/create_order', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }).then(async response => {
      if (response.status === 200) {
        const order = await response.json();
        message.success('created menu item ' + order.name);
        setOrders([...orders, order]);

      } else message.error(
          `Failed to create menu item:\n ${JSON.stringify(await response.json())}`);
    }).catch(res=>{message.error(res)})
  };

  const onDelete = async (user: any) => {
    const {id} = user;
    setIsModalOpen(false);
    fetch('/api/delete_user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    }).then(async response => {
      if (response.status === 200) {
        await response.json();
        message.success('Deleted customer ' + user.name);
        setUsers(users.filter(u=> u.id !== id ));

      } else message.error(
          `Failed to delete customer:\n ${user.name}`);
    }).catch(res=>{message.error(res)})
  };

  const onDelete2 = async (order: any) => {
    const {id} = order;
    setIsModalOpen2(false);
    fetch('/api/delete_order', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    }).then(async response => {
      if (response.status === 200) {
        await response.json();
        message.success('Deleted menu item ' + order.name);
        setOrders(orders.filter(u=> u.id !== id ));

      } else message.error(
          `Failed to delete menu item:\n ${order.name}`);
    }).catch(res=>{message.error(res)})
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Seat Number',
      dataIndex: 'seat',
      key: 'seat',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Bill',
      dataIndex: 'bill',
      key: 'bill',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
          <Space size="middle">
            <a onClick={()=>onDelete(record)}>Delete</a>
          </Space>
      ),
    },
  ];

  const columns2: ColumnsType<Order> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ingredients',
      dataIndex: 'ingredients',
      key: 'ingredients',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
          <Space size="middle">
            <a onClick={()=>onDelete2(record)}>Delete</a>
          </Space>
      ),
    },
  ];


  const onReset = () => {
    form.resetFields();
  };
  const onReset2 = () => {
    form2.resetFields();
  };

  const onFill = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    //const email = faker.internet.email({ firstName, lastName });
    //const street = faker.location.streetAddress();
    //const city = faker.location.city();
    //const state  = faker.location.state({ abbreviated: true });
    //const zip = faker.location.zipCode()
    //<Button  htmlType="button" onClick={onFill2}>
    // Fill form
    //</Button>

    form.setFieldsValue({
      name: `${firstName} ${lastName}`,
      //email: email,
      //address:
      //    `${street}, ${city}, ${state}, US, ${zip}`,
      //bill: 1.00
    });
  };
  const onFill2 = () => {
    const name = faker.person.firstName();
  };
  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
    form2.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
    form2.resetFields();
  };
  useEffect(()=>{
    fetch('api/all_user', {method: "GET"})
        .then(res => {
          res.json().then(
              (json=> {setUsers(json)})
          )
        });
    fetch('api/all_order', {method: "GET"})
        .then(res => {
          res.json().then(
              (json=> {setOrders(json)})
          )
        });
  }, []);

  if (!users || !orders) return "Give me a second";

  return  <>
    <Button type="primary" onClick={showModal}>
      Add Customer
    </Button>
    <Button type="primary" onClick={showModal2}>
      Add Menu Item
    </Button>
    <Modal title="Add A New Customer" onCancel={handleCancel}
           open={isModalOpen} footer={null}  width={800}>
      <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="seat" label="(Unique) Seat Number" rules={[{ required: true }]}>
          <InputNumber 
            step={1} 
            min={1}
          />
        </Form.Item>
        <Form.Item name="order" label="Order" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bill" label="Bill $" rules={[{ required: true }]}>
          <InputNumber
            step={0.01} 
            min={0}
          />
        </Form.Item>

        <Form.Item {...tailLayout} >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button  htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    <Modal title="Add A New Menu Item" onCancel={handleCancel2}
           open={isModalOpen2} footer={null}  width={800}>
      <Form
          {...layout}
          form={form2}
          name="control-hooks"
          onFinish={onFinish2}
          style={{ maxWidth: 600 }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="ingredients" label="Ingredients" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price $" rules={[{ required: true }]}>
          <InputNumber 
            step={0.01} 
            min={0}
          />
        </Form.Item>

        <Form.Item {...tailLayout} >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset2}>
            Reset
          </Button>
          <Button  htmlType="button" onClick={handleCancel2}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    {/*<p>{JSON.stringify(users)}</p>*/}
    {/*<p>{JSON.stringify(orders)}</p>*/}
    <Table columns={columns} dataSource={users} />;
    <Table columns={columns2} dataSource={orders} />;
  </>;


}
