import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  Avatar,
  Tag,
  Space,
  Card,
  message,
  Popconfirm,
  Modal,
  Form,
  Select,
  Switch,
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Option } = Select;

// 模拟数据
const generateMockUsers = () => {
  const roles = ['管理员', '普通用户'];
  const statuses = ['启用', '禁用'];
  const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
  const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];

  return Array.from({ length: 50 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName}${lastName}${String(index + 1).padStart(2, '0')}`;

    return {
      id: index + 1,
      username,
      fullName: `${firstName}${lastName}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${username}`,
    };
  });
};

const UserManagement = () => {
  const [users, setUsers] = useState(generateMockUsers());
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 搜索过滤
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.fullName.includes(searchText)
  );

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar) => (
        <Avatar src={avatar} icon={<UserOutlined />} size={40} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 100,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => (
        <Tag color={role === '管理员' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: '管理员' },
        { text: '普通用户', value: '普通用户' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '启用' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: '启用', value: '启用' },
        { text: '禁用', value: '禁用' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该用户？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 编辑用户
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  // 删除用户
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('删除成功');
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // 更新用户
        setUsers(users.map(user =>
          user.id === editingUser.id
            ? { ...user, ...values }
            : user
        ));
        message.success('更新成功');
      } else {
        // 新增用户
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...values,
          createTime: new Date().toLocaleDateString('zh-CN'),
          avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${values.username}`,
        };
        setUsers([...users, newUser]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  return (
    <div>
      <Card title="用户管理" style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索用户名或姓名"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              setIsModalVisible(true);
            }}
          >
            新增用户
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 编辑/新增用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="管理员">管理员</Option>
              <Option value="普通用户">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;