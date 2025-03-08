<template>
  <div class="weather-container">
    <!-- 搜索和选择区域 -->
    <div class="search-section mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <a-input-search
          v-model="searchQuery"
          placeholder="输入城市名称"
          class="md:w-64"
          @search="onSearch"
        />
        <a-select
          v-model="weatherType"
          class="md:w-32"
          @change="updateHeatmap"
        >
          <a-select-option value="temperature">温度</a-select-option>
          <a-select-option value="humidity">湿度</a-select-option>
          <a-select-option value="pressure">气压</a-select-option>
        </a-select>
      </div>
    </div>

    <!-- 天气信息卡片 -->
    <div v-if="weatherData" class="weather-card mb-6">
      <a-card>
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-2">{{ weatherData.icon }}</span>
              <span class="text-xl font-bold">{{ weatherData.city }}</span>
            </div>
            <span class="text-gray-500">{{ weatherData.country }}</span>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-4xl font-bold text-blue-600">{{ weatherData.temperature }}°C</div>
            <div class="text-gray-500">温度</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-green-600">{{ weatherData.humidity }}%</div>
            <div class="text-gray-500">湿度</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-600">{{ weatherData.pressure }}hPa</div>
            <div class="text-gray-500">气压</div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center">
            <component :is="Icons.WindOutlined" class="text-gray-500 mr-2" />
            <span>风速: {{ weatherData.windSpeed }} m/s</span>
          </div>
          <div class="flex items-center">
            <component :is="Icons.CompassOutlined" class="text-gray-500 mr-2" />
            <span>风向: {{ weatherData.windDirection }}°</span>
          </div>
        </div>
        <div class="mt-4 text-center text-lg text-gray-600">
          {{ weatherData.description }}
        </div>
      </a-card>
    </div>

    <!-- 统计信息卡片 -->
    <div v-if="weatherStats" class="stats-card mb-6">
      <a-card title="24小时统计">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ weatherStats.avgTemperature.toFixed(1) }}°C</div>
            <div class="text-gray-500">平均温度</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ weatherStats.avgHumidity.toFixed(1) }}%</div>
            <div class="text-gray-500">平均湿度</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ weatherStats.avgPressure.toFixed(1) }}hPa</div>
            <div class="text-gray-500">平均气压</div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 天气趋势图表 -->
    <div class="weather-trends mb-6">
      <a-card title="天气趋势">
        <a-tabs v-model="activeTab">
          <a-tab-pane key="history" tab="历史记录">
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <div class="text-gray-600">最近24小时天气变化</div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span class="text-sm">温度</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span class="text-sm">湿度</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span class="text-sm">气压</span>
                  </div>
                </div>
              </div>
            </div>
            <v-chart class="chart" :option="historyChartOption" autoresize />
          </a-tab-pane>
          <a-tab-pane key="forecast" tab="天气预报">
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <div class="text-gray-600">未来7天天气预报</div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span class="text-sm">温度</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span class="text-sm">湿度</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span class="text-sm">气压</span>
                  </div>
                </div>
              </div>
            </div>
            <v-chart class="chart" :option="forecastChartOption" autoresize />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>

    <!-- 地图区域 -->
    <div class="map-section">
      <div id="map" class="w-full h-[500px] rounded-lg shadow-lg"></div>
    </div>

    <!-- 热门城市列表 -->
    <div class="popular-cities mt-6">
      <a-card title="热门城市">
        <div class="flex flex-wrap gap-2">
          <a-tag
            v-for="city in popularCities"
            :key="city.name"
            class="cursor-pointer hover:bg-blue-50"
            @click="onSearch(city.name)"
          >
            {{ city.name }}
          </a-tag>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
import Heatmap from 'ol/layer/Heatmap'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import axios from 'axios'
import * as Icons from '@ant-design/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const API_BASE_URL = 'http://localhost:3000/api'

const map = ref(null)
const heatmapLayer = ref(null)
const searchQuery = ref('')
const weatherType = ref('temperature')
const weatherData = ref(null)
const weatherStats = ref(null)
const popularCities = ref([])
const activeTab = ref('history')
const historyData = ref([])
const forecastData = ref([])

// 注册图标组件
const WindOutlined = Icons.WindOutlined
const CompassOutlined = Icons.CompassOutlined

// 历史数据图表配置
const historyChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      let result = params[0].axisValue + '<br/>';
      params.forEach(param => {
        const value = param.value;
        let unit = '';
        switch(param.seriesName) {
          case '温度':
            unit = '°C';
            break;
          case '湿度':
            unit = '%';
            break;
          case '气压':
            unit = 'hPa';
            break;
        }
        result += `${param.marker} ${param.seriesName}: ${value}${unit}<br/>`;
      });
      return result;
    }
  },
  legend: {
    show: false
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: historyData.value.map(item => item.time),
    axisLabel: {
      formatter: (value) => {
        return value.split(':')[0] + '时';
      }
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '温度(°C)',
      position: 'left',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#1890ff'
        }
      }
    },
    {
      type: 'value',
      name: '湿度(%)',
      position: 'right',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#52c41a'
        }
      }
    },
    {
      type: 'value',
      name: '气压(hPa)',
      position: 'right',
      offset: 80,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#722ed1'
        }
      }
    }
  ],
  series: [
    {
      name: '温度',
      type: 'line',
      data: historyData.value.map(item => item.temperature),
      yAxisIndex: 0,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#1890ff'
      },
      itemStyle: {
        color: '#1890ff'
      }
    },
    {
      name: '湿度',
      type: 'line',
      data: historyData.value.map(item => item.humidity),
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#52c41a'
      },
      itemStyle: {
        color: '#52c41a'
      }
    },
    {
      name: '气压',
      type: 'line',
      data: historyData.value.map(item => item.pressure),
      yAxisIndex: 2,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
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

// 天气预报图表配置
const forecastChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      let result = params[0].axisValue + '<br/>';
      params.forEach(param => {
        const value = param.value;
        let unit = '';
        switch(param.seriesName) {
          case '温度':
            unit = '°C';
            break;
          case '湿度':
            unit = '%';
            break;
          case '气压':
            unit = 'hPa';
            break;
        }
        result += `${param.marker} ${param.seriesName}: ${value}${unit}<br/>`;
      });
      return result;
    }
  },
  legend: {
    show: false
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: forecastData.value.map(item => item.date),
    axisLabel: {
      formatter: (value) => {
        return value.split('/').slice(1).join('/');
      }
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '温度(°C)',
      position: 'left',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#1890ff'
        }
      }
    },
    {
      type: 'value',
      name: '湿度(%)',
      position: 'right',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#52c41a'
        }
      }
    },
    {
      type: 'value',
      name: '气压(hPa)',
      position: 'right',
      offset: 80,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#722ed1'
        }
      }
    }
  ],
  series: [
    {
      name: '温度',
      type: 'line',
      data: forecastData.value.map(item => item.temperature),
      yAxisIndex: 0,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#1890ff'
      },
      itemStyle: {
        color: '#1890ff'
      }
    },
    {
      name: '湿度',
      type: 'line',
      data: forecastData.value.map(item => item.humidity),
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#52c41a'
      },
      itemStyle: {
        color: '#52c41a'
      }
    },
    {
      name: '气压',
      type: 'line',
      data: forecastData.value.map(item => item.pressure),
      yAxisIndex: 2,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
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

onMounted(async () => {
  // 初始化地图
  map.value = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat([114.3162, 30.5810]), // 武汉坐标
      zoom: 12
    })
  })

  // 初始化热力图层
  const vectorSource = new VectorSource()
  heatmapLayer.value = new Heatmap({
    source: vectorSource,
    blur: 15,
    radius: 10
  })
  map.value.addLayer(heatmapLayer.value)

  // 获取热门城市列表
  try {
    const response = await axios.get(`${API_BASE_URL}/cities/popular`)
    popularCities.value = response.data
  } catch (error) {
    console.error('Error fetching popular cities:', error)
  }

  // 默认查询武汉天气
  await onSearch('武汉')
})

const onSearch = async (value) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${value}`)
    weatherData.value = response.data
    
    // 更新地图视图
    map.value.getView().setCenter(fromLonLat([weatherData.value.lon, weatherData.value.lat]))
    map.value.getView().setZoom(12)

    // 获取天气统计信息
    const statsResponse = await axios.get(`${API_BASE_URL}/weather/stats/${value}`)
    weatherStats.value = statsResponse.data

    // 获取历史数据
    const historyResponse = await axios.get(`${API_BASE_URL}/weather/history/${value}`)
    historyData.value = historyResponse.data

    // 获取天气预报
    const forecastResponse = await axios.get(`${API_BASE_URL}/weather/forecast/${value}`)
    forecastData.value = forecastResponse.data

    // 更新热力图
    await updateHeatmap()
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

const updateHeatmap = async () => {
  if (!weatherData.value) return

  const value = weatherData.value[weatherType.value]
  const vectorSource = heatmapLayer.value.getSource()
  vectorSource.clear()

  // 添加热力点
  vectorSource.addFeature({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [weatherData.value.lon, weatherData.value.lat]
    },
    properties: {
      value: value
    }
  })
}
</script>

<style scoped>
.weather-container {
  @apply max-w-7xl mx-auto px-4;
}

.search-section {
  @apply bg-white p-4 rounded-lg shadow-sm;
}

.weather-card {
  @apply bg-white rounded-lg shadow-sm;
}

.stats-card {
  @apply bg-white rounded-lg shadow-sm;
}

.map-section {
  @apply bg-white p-4 rounded-lg shadow-sm;
}

.popular-cities {
  @apply bg-white rounded-lg shadow-sm;
}

#map {
  @apply rounded-lg overflow-hidden;
}

.chart {
  height: 400px;
  width: 100%;
}

.weather-trends {
  @apply bg-white rounded-lg shadow-sm;
}
</style> 