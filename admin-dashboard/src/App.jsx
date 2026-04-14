import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  TableOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import UserManagement from './components/UserManagement';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  const [currentPage, setCurrentPage] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderContent = () => {
    switch (currentPage) {
      case '2':
        return <UserManagement />;
      default:
        return (
          <div>
            <h1>欢迎使用后台管理系统</h1>
            <p>这是一个基于 React + Vite + Ant Design 的后台管理原型系统。</p>
            <div style={{ marginTop: 32 }}>
              <h3>功能模块：</h3>
              <ul>
                <li>Dashboard 仪表板</li>
                <li>用户管理</li>
                <li>数据表格</li>
                <li>数据分析</li>
                <li>报表系统</li>
                <li>系统设置</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible>
        <div className="logo" style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPage]}
          onClick={({ key }) => setCurrentPage(key)}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: '用户管理',
            },
            {
              key: '3',
              icon: <TableOutlined />,
              label: '数据表格',
            },
            {
              key: '4',
              icon: <BarChartOutlined />,
              label: '数据分析',
            },
            {
              key: '5',
              icon: <FileTextOutlined />,
              label: '报表系统',
            },
            {
              key: '6',
              icon: <SettingOutlined />,
              label: '系统设置',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: 0,
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 24
        }}>
          <h2 style={{ marginLeft: 24, marginBottom: 0 }}>后台管理系统</h2>
          <div style={{ color: '#666' }}>欢迎使用</div>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;