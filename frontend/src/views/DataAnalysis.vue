<template>
  <div class="data-analysis-container">
    <!-- 城市选择器 -->
    <div class="city-selector mb-6">
      <a-card>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <a-select
              v-model="selectedCity"
              class="w-64"
              @change="onCityChange"
            >
              <a-select-option value="武汉">武汉</a-select-option>
              <a-select-option value="北京">北京</a-select-option>
              <a-select-option value="上海">上海</a-select-option>
              <a-select-option value="广州">广州</a-select-option>
              <a-select-option value="深圳">深圳</a-select-option>
            </a-select>
            <span class="text-gray-500">数据更新时间：{{ lastUpdateTime }}</span>
          </div>
          <a-button 
            type="primary" 
            :loading="loading"
            @click="refreshData"
          >
            <template #icon>
              <component :is="Icons.ReloadOutlined" :class="{ 'animate-spin': loading }" />
            </template>
            {{ loading ? '刷新中...' : '刷新数据' }}
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <a-card class="overview-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.ThermometerOutlined" class="text-blue-500 mr-2" />
            <span>温度趋势</span>
          </div>
        </template>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-500">{{ weatherStats?.avgTemperature?.toFixed(1) || '--' }}°C</div>
          <div class="text-sm text-gray-500">平均温度</div>
        </div>
      </a-card>
      <a-card class="overview-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.WaterOutlined" class="text-green-500 mr-2" />
            <span>湿度趋势</span>
          </div>
        </template>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-500">{{ weatherStats?.avgHumidity?.toFixed(1) || '--' }}%</div>
          <div class="text-sm text-gray-500">平均湿度</div>
        </div>
      </a-card>
      <a-card class="overview-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.CloudOutlined" class="text-purple-500 mr-2" />
            <span>气压趋势</span>
          </div>
        </template>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-500">{{ weatherStats?.avgPressure?.toFixed(1) || '--' }}hPa</div>
          <div class="text-sm text-gray-500">平均气压</div>
        </div>
      </a-card>
      <a-card class="overview-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.WindOutlined" class="text-orange-500 mr-2" />
            <span>风速趋势</span>
          </div>
        </template>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-500">{{ weatherStats?.avgWindSpeed?.toFixed(1) || '--' }} m/s</div>
          <div class="text-sm text-gray-500">平均风速</div>
        </div>
      </a-card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 温度变化趋势 -->
      <a-card class="chart-card">
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <component :is="Icons.ThermometerOutlined" class="text-blue-500 mr-2" />
              <span>温度变化趋势</span>
            </div>
            <a-radio-group v-model="temperatureTimeRange" size="small">
              <a-radio-button value="24">24小时</a-radio-button>
              <a-radio-button value="7">7天</a-radio-button>
            </a-radio-group>
          </div>
        </template>
        <v-chart class="chart" :option="temperatureChartOption" autoresize />
      </a-card>

      <!-- 天气类型分布 -->
      <a-card class="chart-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.PieChartOutlined" class="text-green-500 mr-2" />
            <span>天气类型分布</span>
          </div>
        </template>
        <v-chart class="chart" :option="weatherTypeChartOption" autoresize />
      </a-card>

      <!-- 湿度变化趋势 -->
      <a-card class="chart-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.WaterOutlined" class="text-blue-500 mr-2" />
            <span>湿度变化趋势</span>
          </div>
        </template>
        <v-chart class="chart" :option="humidityChartOption" autoresize />
      </a-card>

      <!-- 气压变化趋势 -->
      <a-card class="chart-card">
        <template #title>
          <div class="flex items-center">
            <component :is="Icons.CloudOutlined" class="text-purple-500 mr-2" />
            <span>气压变化趋势</span>
          </div>
        </template>
        <v-chart class="chart" :option="pressureChartOption" autoresize />
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import * as Icons from '@ant-design/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { message } from 'ant-design-vue'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const API_BASE_URL = 'http://localhost:3000/api'

const selectedCity = ref('武汉')
const lastUpdateTime = ref('')
const temperatureTimeRange = ref('24')
const weatherStats = ref(null)
const historyData = ref([])
const forecastData = ref([])
const loading = ref(false)

// 温度变化趋势图表配置
const temperatureChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c}°C'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: temperatureTimeRange.value === '24' 
      ? (historyData.value || []).map(item => item?.time?.split(':')[0] + '时' || '')
      : (forecastData.value || []).map(item => item?.date?.split('/').slice(1).join('/') || '')
  },
  yAxis: {
    type: 'value',
    name: '温度(°C)'
  },
  series: [
    {
      name: '温度',
      type: 'line',
      smooth: true,
      data: temperatureTimeRange.value === '24'
        ? (historyData.value || []).map(item => item?.temperature || 0)
        : (forecastData.value || []).map(item => item?.temperature || 0),
      lineStyle: {
        width: 3,
        color: '#1890ff'
      },
      itemStyle: {
        color: '#1890ff'
      }
    }
  ]
}))

// 天气类型分布图表配置
const weatherTypeChartOption = computed(() => {
  const weatherTypes = {}
  ;(historyData.value || []).forEach(item => {
    if (item?.description) {
      weatherTypes[item.description] = (weatherTypes[item.description] || 0) + 1
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '天气类型',
        type: 'pie',
        radius: '50%',
        data: Object.entries(weatherTypes).map(([name, value]) => ({
          name,
          value
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})

// 湿度变化趋势图表配置
const humidityChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c}%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: (historyData.value || []).map(item => item?.time?.split(':')[0] + '时' || '')
  },
  yAxis: {
    type: 'value',
    name: '湿度(%)'
  },
  series: [
    {
      name: '湿度',
      type: 'line',
      smooth: true,
      data: (historyData.value || []).map(item => item?.humidity || 0),
      lineStyle: {
        width: 3,
        color: '#52c41a'
      },
      itemStyle: {
        color: '#52c41a'
      }
    }
  ]
}))

// 气压变化趋势图表配置
const pressureChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c}hPa'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: (historyData.value || []).map(item => item?.time?.split(':')[0] + '时' || '')
  },
  yAxis: {
    type: 'value',
    name: '气压(hPa)'
  },
  series: [
    {
      name: '气压',
      type: 'line',
      smooth: true,
      data: (historyData.value || []).map(item => item?.pressure || 0),
      lineStyle: {
        width: 3,
        color: '#722ed1'
      },
      itemStyle: {
        color: '#722ed1'
      }
    }
  ]
}))

const fetchData = async () => {
  try {
    loading.value = true
    // 获取天气统计信息
    const statsResponse = await axios.get(`${API_BASE_URL}/weather/stats/${selectedCity.value}`)
    weatherStats.value = statsResponse.data || {}

    // 获取历史数据
    const historyResponse = await axios.get(`${API_BASE_URL}/weather/history/${selectedCity.value}`)
    historyData.value = historyResponse.data || []

    // 获取天气预报
    const forecastResponse = await axios.get(`${API_BASE_URL}/weather/forecast/${selectedCity.value}`)
    forecastData.value = forecastResponse.data || []

    lastUpdateTime.value = new Date().toLocaleString()
    return true
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  } finally {
    loading.value = false
  }
}

const onCityChange = async () => {
  loading.value = true
  try {
    await fetchData()
    message.success('数据更新成功')
  } catch (error) {
    message.error('数据更新失败，请重试')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await fetchData()
    message.success('数据刷新成功')
  } catch (error) {
    message.error('数据刷新失败，请重试')
  } finally {
    loading.value = false
  }
}

// 监听城市变化
watch(selectedCity, () => {
  onCityChange()
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.data-analysis-container {
  @apply max-w-7xl mx-auto px-4;
}

.overview-card {
  @apply bg-white rounded-lg shadow-sm;
}

.chart-card {
  @apply bg-white rounded-lg shadow-sm;
}

.chart {
  height: 400px;
  width: 100%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style> 