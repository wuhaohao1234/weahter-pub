<template>
  <div class="about-container">
    <!-- 项目介绍 -->
    <div class="mb-8">
      <a-card>
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.InfoCircleOutlined" class="text-blue-500 mr-2" />
            <span>项目介绍</span>
          </div>
        </template>
        <div class="prose max-w-none">
          <p class="text-gray-600">
            气象信息查询与分析系统是一个基于 Vue.js 和 Node.js 开发的现代化天气数据可视化平台。
            系统集成了实时天气查询、历史数据分析、天气预报等功能，为用户提供全面的气象信息服务。
          </p>
          <h3 class="text-lg font-semibold mt-4 mb-2">主要功能</h3>
          <ul class="list-disc list-inside text-gray-600">
            <li>实时天气查询：支持全球城市天气信息查询</li>
            <li>历史数据分析：提供24小时天气变化趋势分析</li>
            <li>天气预报：展示未来7天天气预报</li>
            <li>数据可视化：使用多种图表展示天气数据</li>
            <li>热力图展示：直观显示温度、湿度、气压分布</li>
          </ul>
          <h3 class="text-lg font-semibold mt-4 mb-2">技术特点</h3>
          <ul class="list-disc list-inside text-gray-600">
            <li>前端：Vue 3 + Ant Design Vue + ECharts</li>
            <li>后端：Node.js + Express + MySQL</li>
            <li>数据源：OpenMeteo API</li>
            <li>地图：OpenLayers</li>
            <li>样式：Tailwind CSS</li>
          </ul>
        </div>
      </a-card>
    </div>

    <!-- 团队信息 -->
    <div class="mb-8">
      <a-card>
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.TeamOutlined" class="text-green-500 mr-2" />
            <span>开发团队</span>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="team-member">
            <div class="text-center">
              <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <component :is="Icons.UserOutlined" class="text-4xl text-gray-500" />
              </div>
              <h3 class="text-lg font-semibold">开发者</h3>
              <p class="text-gray-600">全栈开发工程师</p>
            </div>
          </div>
          <div class="team-member">
            <div class="text-center">
              <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <component :is="Icons.UserOutlined" class="text-4xl text-gray-500" />
              </div>
              <h3 class="text-lg font-semibold">设计师</h3>
              <p class="text-gray-600">UI/UX 设计师</p>
            </div>
          </div>
          <div class="team-member">
            <div class="text-center">
              <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <component :is="Icons.UserOutlined" class="text-4xl text-gray-500" />
              </div>
              <h3 class="text-lg font-semibold">测试工程师</h3>
              <p class="text-gray-600">质量保证工程师</p>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 联系方式 -->
    <div>
      <a-card>
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.ContactsOutlined" class="text-purple-500 mr-2" />
            <span>联系我们</span>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-4">联系方式</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <component :is="Icons.MailOutlined" class="text-gray-500 mr-2" />
                <span>邮箱：contact@example.com</span>
              </div>
              <div class="flex items-center">
                <component :is="Icons.PhoneOutlined" class="text-gray-500 mr-2" />
                <span>电话：+86 123 4567 8900</span>
              </div>
              <div class="flex items-center">
                <component :is="Icons.EnvironmentOutlined" class="text-gray-500 mr-2" />
                <span>地址：武汉市洪山区</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">关注我们</h3>
            <div class="flex space-x-4">
              <a-button type="text" class="text-blue-500">
                <template #icon><component :is="Icons.WechatOutlined" /></template>
                微信
              </a-button>
              <a-button type="text" class="text-blue-500">
                <template #icon><component :is="Icons.WeiboOutlined" /></template>
                微博
              </a-button>
              <a-button type="text" class="text-blue-500">
                <template #icon><component :is="Icons.GithubOutlined" /></template>
                GitHub
              </a-button>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import * as Icons from '@ant-design/icons-vue'
</script>

<style scoped>
.about-container {
  @apply max-w-7xl mx-auto px-4;
}

.team-member {
  @apply bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow;
}
</style> 