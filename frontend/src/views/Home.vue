<template>
  <div class="space-y-12">
    <!-- 英雄区域 -->
    <div class="relative overflow-hidden rounded-2xl">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
      <div class="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div class="relative px-8 py-16 md:px-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              智能气象信息<br class="hidden md:block" />
              查询与分析系统
            </h1>
            <p class="text-lg text-white/90 mb-8 max-w-2xl">
              基于OpenMeteo API，为您提供全球范围内的实时天气数据、智能分析和可视化展示
            </p>
            <div class="flex flex-wrap gap-4 justify-center md:justify-start">
              <a-button type="primary" size="large" class="bg-white text-blue-600 hover:bg-blue-50">
                开始使用
              </a-button>
              <a-button size="large" class="bg-white/10 text-white hover:bg-white/20">
                了解更多
              </a-button>
            </div>
          </div>
          <div class="w-64 md:w-96">
            <weather-icon class="w-full h-full text-white/20 animate-float" />
          </div>
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <a-card class="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">100+</div>
          <div class="text-gray-600">覆盖城市</div>
        </div>
      </a-card>
      <a-card class="bg-gradient-to-br from-green-50 to-green-100 border-0">
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">24/7</div>
          <div class="text-gray-600">实时更新</div>
        </div>
      </a-card>
      <a-card class="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
          <div class="text-gray-600">数据准确率</div>
        </div>
      </a-card>
      <a-card class="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">50ms</div>
          <div class="text-gray-600">响应速度</div>
        </div>
      </a-card>
    </div>

    <!-- 核心功能 -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">核心功能</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        我们提供全面的气象信息服务，帮助您更好地了解和预测天气变化
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <a-card hoverable class="text-center transition-all duration-300 hover:shadow-lg border-0">
        <div class="p-8">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <weather-icon class="w-12 h-12 text-blue-500" />
          </div>
          <h3 class="text-xl font-semibold mb-4">实时天气查询</h3>
          <p class="text-gray-600">
            支持全球城市天气查询，提供温度、湿度、气压等详细数据
          </p>
        </div>
      </a-card>

      <a-card hoverable class="text-center transition-all duration-300 hover:shadow-lg border-0">
        <div class="p-8">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <line-chart-outlined class="text-4xl text-green-500" />
          </div>
          <h3 class="text-xl font-semibold mb-4">数据分析</h3>
          <p class="text-gray-600">
            智能分析天气趋势，预测未来天气变化，生成专业报告
          </p>
        </div>
      </a-card>

      <a-card hoverable class="text-center transition-all duration-300 hover:shadow-lg border-0">
        <div class="p-8">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-50 flex items-center justify-center">
            <global-outlined class="text-4xl text-purple-500" />
          </div>
          <h3 class="text-xl font-semibold mb-4">全球覆盖</h3>
          <p class="text-gray-600">
            覆盖全球主要城市，支持多语言查询，随时随地获取信息
          </p>
        </div>
      </a-card>
    </div>

    <!-- 系统特点 -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">系统特点</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        采用先进技术，为您提供最优质的气象信息服务
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <check-circle-outlined class="text-2xl text-blue-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">实时数据</h3>
            <p class="text-gray-600">采用OpenMeteo API，确保数据实时性和准确性</p>
          </div>
        </div>
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <check-circle-outlined class="text-2xl text-green-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">智能分析</h3>
            <p class="text-gray-600">提供天气趋势分析和预测功能</p>
          </div>
        </div>
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <check-circle-outlined class="text-2xl text-purple-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">可视化展示</h3>
            <p class="text-gray-600">使用热力图直观展示天气数据分布</p>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <check-circle-outlined class="text-2xl text-orange-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">多维度数据</h3>
            <p class="text-gray-600">支持温度、湿度、气压、风速等多维度数据展示</p>
          </div>
        </div>
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <check-circle-outlined class="text-2xl text-red-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">历史记录</h3>
            <p class="text-gray-600">保存历史天气数据，支持数据回溯分析</p>
          </div>
        </div>
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <check-circle-outlined class="text-2xl text-indigo-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">响应式设计</h3>
            <p class="text-gray-600">适配各种设备，提供良好的用户体验</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  LineChartOutlined,
  GlobalOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import WeatherIcon from '../components/icons/WeatherIcon.vue'
</script>

<style scoped>
.bg-grid-white {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style> 