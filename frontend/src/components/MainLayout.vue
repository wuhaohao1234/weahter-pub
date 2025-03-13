<template>
  <a-layout class="min-h-screen">
    <a-layout-sider v-model="collapsed" collapsible class="bg-gradient-to-b from-blue-600 to-blue-800">
      <div class="logo p-6 text-white text-center">
        <div class="text-2xl font-bold mb-2">{{ collapsed ? 'W' : 'Weather' }}</div>
        <div class="text-sm opacity-75">气象信息查询系统</div>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        class="border-0"
        @click="handleMenuClick"
      >
        <a-menu-item key="home">
          <template #icon>
            <home-outlined />
          </template>
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="weather" @click="$router.push('/weather')">
          <template #icon>
            <cloud-outlined />
          </template>
          <span>天气查询</span>
        </a-menu-item>
        <a-menu-item key="map" @click="$router.push('/map')">
          <template #icon>
            <environment-outlined />
          </template>
          <span>气象地图</span>
        </a-menu-item>
        <a-menu-item key="analysis" @click="$router.push('/analysis')">
          <template #icon>
            <bar-chart-outlined />
          </template>
          <span>数据分析</span>
        </a-menu-item>
        <a-menu-item key="about">
          <template #icon>
            <info-circle-outlined />
          </template>
          <span>关于我们</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="bg-white px-8 flex items-center justify-between shadow-sm">
        <div class="flex items-center">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger text-xl text-gray-600 hover:text-blue-600 transition-colors"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger text-xl text-gray-600 hover:text-blue-600 transition-colors"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        <div class="flex items-center space-x-6">
          <a-badge :count="5">
            <bell-outlined class="text-xl text-gray-600 hover:text-blue-600 transition-colors" />
          </a-badge>
          <a-dropdown>
            <a class="ant-dropdown-link flex items-center space-x-2" @click.prevent>
              <a-avatar class="bg-blue-100 text-blue-600">
                <user-outlined />
              </a-avatar>
              <span class="text-gray-600">管理员</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <user-outlined />
                  个人资料
                </a-menu-item>
                <a-menu-item key="settings">
                  <setting-outlined />
                  设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="p-8 bg-gray-50">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="text-center bg-white border-t border-gray-100">
        <div class="text-gray-500">
          Weather App ©2024 Created by Your Name
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  CloudOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const selectedKeys = ref(['home'])
const route = useRoute()
const router = useRouter()

// 处理菜单点击事件
const handleMenuClick = ({ key }) => {
  const path = key === 'home' ? '/' : `/${key}`
  router.push(path)
}

// 根据路由更新选中的菜单项
watch(() => route.path, (newPath) => {
  const key = newPath === '/' ? 'home' : newPath.slice(1)
  selectedKeys.value = [key]
}, { immediate: true })
</script>

<style scoped>
.logo {
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.trigger {
  padding: 0 24px;
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: all 0.3s;
}

.ant-menu-item {
  margin: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s;
}

.ant-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.ant-menu-item-selected {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.ant-dropdown-link {
  cursor: pointer;
  transition: all 0.3s;
}

.ant-dropdown-link:hover {
  color: #1890ff;
}

:deep(.ant-layout-sider) {
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.1);
}

:deep(.ant-layout-header) {
  padding: 0;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.ant-layout-content) {
  min-height: calc(100vh - 64px - 70px);
}

:deep(.ant-layout-footer) {
  padding: 16px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 