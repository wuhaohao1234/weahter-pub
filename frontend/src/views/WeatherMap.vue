<template>
  <div class="weather-map-container">
    <!-- 地图控制面板 -->
    <div class="map-controls mb-6">
      <a-card>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <a-select
              v-model="selectedDataType"
              class="w-32"
              @change="updateMapData"
            >
              <a-select-option value="temperature">温度</a-select-option>
              <a-select-option value="humidity">湿度</a-select-option>
              <a-select-option value="pressure">气压</a-select-option>
            </a-select>
            <a-select
              v-model="selectedTime"
              class="w-32"
              @change="updateMapData"
            >
              <a-select-option value="current">当前</a-select-option>
              <a-select-option value="24h">24小时</a-select-option>
              <a-select-option value="7d">7天</a-select-option>
            </a-select>
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

    <!-- 地图区域 -->
    <div class="map-section">
      <a-card>
        <div id="map" class="w-full h-[600px] rounded-lg"></div>
      </a-card>
    </div>

    <!-- 城市天气信息弹窗 -->
    <a-modal
      v-model:open="cityModalVisible"
      :title="selectedCity ? `${selectedCity.name}天气信息` : '天气信息'"
      @cancel="closeCityModal"
      :footer="null"
      width="800px"
    >
      <div v-if="selectedCity" class="city-weather-info">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-blue-600">{{ selectedCity.temperature }}°C</div>
            <div class="text-gray-500">温度</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-green-600">{{ selectedCity.humidity }}%</div>
            <div class="text-gray-500">湿度</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-600">{{ selectedCity.pressure }}hPa</div>
            <div class="text-gray-500">气压</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-orange-600">{{ selectedCity.windSpeed }} m/s</div>
            <div class="text-gray-500">风速</div>
          </div>
        </div>
        <div class="text-center text-lg text-gray-600 mb-6">
          {{ selectedCity.description }}
        </div>
        <v-chart class="chart" :option="cityWeatherChartOption" autoresize />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import * as Icons from '@ant-design/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GeoComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { message } from 'ant-design-vue'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GeoComponent
])

const API_BASE_URL = 'http://localhost:3000/api'

const map = ref(null)
const selectedDataType = ref('temperature')
const selectedTime = ref('current')
const loading = ref(false)
const cityModalVisible = ref(false)
const selectedCity = ref(null)
const cityWeatherData = ref([])

// 中国主要城市数据
const cities = [
  // 华北地区
  { name: '北京市', coordinates: [116.4053, 39.9042] },
  { name: '天津市', coordinates: [117.2010, 39.0842] },
  { name: '石家庄市', coordinates: [114.5149, 38.0428] },
  { name: '太原市', coordinates: [112.5492, 37.8706] },
  { name: '呼和浩特市', coordinates: [111.7493, 40.8424] },
  
  // 东北地区
  { name: '沈阳市', coordinates: [123.4315, 41.8057] },
  { name: '大连市', coordinates: [121.6147, 38.9140] },
  { name: '长春市', coordinates: [125.3235, 43.8171] },
  { name: '哈尔滨市', coordinates: [126.5358, 45.8032] },
  
  // 华东地区
  { name: '上海市', coordinates: [121.4737, 31.2304] },
  { name: '南京市', coordinates: [118.7969, 32.0584] },
  { name: '杭州市', coordinates: [120.1536, 30.2741] },
  { name: '宁波市', coordinates: [121.5498, 29.8684] },
  { name: '合肥市', coordinates: [117.2272, 31.8206] },
  { name: '福州市', coordinates: [119.2965, 26.0745] },
  { name: '厦门市', coordinates: [118.0894, 24.4798] },
  { name: '南昌市', coordinates: [115.8581, 28.6820] },
  { name: '济南市', coordinates: [117.1209, 36.6510] },
  { name: '青岛市', coordinates: [120.3826, 36.0671] },
  
  // 华中地区
  { name: '郑州市', coordinates: [113.6254, 34.7466] },
  { name: '武汉市', coordinates: [114.3162, 30.5810] },
  { name: '长沙市', coordinates: [112.9388, 28.2278] },
  
  // 华南地区
  { name: '广州市', coordinates: [113.2644, 23.1291] },
  { name: '深圳市', coordinates: [114.0579, 22.5431] },
  { name: '珠海市', coordinates: [113.5767, 22.2707] },
  { name: '南宁市', coordinates: [108.3665, 22.8170] },
  { name: '海口市', coordinates: [110.1999, 20.0444] },
  
  // 西南地区
  { name: '重庆市', coordinates: [106.5516, 29.5630] },
  { name: '成都市', coordinates: [104.0668, 30.5728] },
  { name: '贵阳市', coordinates: [106.6302, 26.6477] },
  { name: '昆明市', coordinates: [102.8329, 24.8801] },
  { name: '拉萨市', coordinates: [91.1172, 29.6469] },
  
  // 西北地区
  { name: '西安市', coordinates: [108.9398, 34.3416] },
  { name: '兰州市', coordinates: [103.8343, 36.0611] },
  { name: '西宁市', coordinates: [101.7782, 36.6171] },
  { name: '银川市', coordinates: [106.2309, 38.4872] },
  { name: '乌鲁木齐市', coordinates: [87.6168, 43.8256] }
]

// 初始化地图
const initMap = async () => {
  const chartDom = document.getElementById('map')
  map.value = echarts.init(chartDom)

  // 加载中国地图数据
  const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
  const chinaMap = await response.json()

  // 注册地图数据
  echarts.registerMap('china', chinaMap)

  // 设置地图配置
  const option = {
    backgroundColor: '#404a59',
    title: {
      text: '全国天气地图',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.componentType === 'series') {
          return `${params.name}<br/>${selectedDataType.value === 'temperature' ? '温度' : 
                 selectedDataType.value === 'humidity' ? '湿度' : '气压'}: ${params.value[2]}`
        }
        return params.name
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      },
      textStyle: {
        color: '#fff'
      }
    },
    geo: {
      map: 'china',
      roam: true,
      center: [105.0, 35.0],
      zoom: 1.2,
      label: {
        show: true,
        color: '#fff'
      },
      itemStyle: {
        areaColor: '#323c48',
        borderColor: '#404a59'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#2a333d'
        }
      }
    },
    series: [
      {
        name: '城市',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: cities.map(city => ({
          name: city.name,
          value: [...city.coordinates, 50]
        })),
        symbolSize: 12,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          color: '#fff'
        },
        itemStyle: {
          color: '#f4e925'
        },
        emphasis: {
          label: {
            show: true
          }
        },
        rippleEffect: {
          brushType: 'stroke'
        }
      },
      {
        name: '热力图',
        type: 'heatmap',
        coordinateSystem: 'geo',
        data: cities.map(city => ({
          name: city.name,
          value: [...city.coordinates, 50]
        })),
        pointSize: 5,
        blurSize: 6,
        minOpacity: 0.3,
        maxOpacity: 0.8
      }
    ]
  }

  map.value.setOption(option)

  // 添加点击事件
  map.value.on('click', (params) => {
    if (params.componentType === 'series') {
      showCityWeather(params.name)
    }
  })
}

// 显示城市天气信息
const showCityWeather = async (cityName) => {
  try {
    loading.value = true
    // 获取当前天气数据
    const currentResponse = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}`)
    selectedCity.value = currentResponse.data

    // 获取历史天气数据
    const historyResponse = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}/history`, {
      params: {
        time: selectedTime.value
      }
    })
    cityWeatherData.value = historyResponse.data

    cityModalVisible.value = true
  } catch (error) {
    console.error('Error fetching city weather:', error)
    if (error.response?.status === 404) {
      message.error('城市未找到')
    } else {
      message.error('获取天气信息失败')
    }
  } finally {
    loading.value = false
  }
}

// 关闭城市天气弹窗
const closeCityModal = () => {
  cityModalVisible.value = false
  selectedCity.value = null
}

// 更新地图数据
const updateMapData = async () => {
  try {
    loading.value = true
    // 获取所有城市的天气数据
    const weatherData = await Promise.all(
      cities.map(async city => {
        try {
          const response = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(city.name)}`)
          return {
            ...city,
            ...response.data
          }
        } catch (error) {
          console.error(`Error fetching weather for ${city.name}:`, error)
          return {
            ...city,
            temperature: null,
            humidity: null,
            pressure: null
          }
        }
      })
    )

    // 更新地图数据，过滤掉没有数据的城市
    const seriesData = weatherData
      .filter(city => city[selectedDataType.value] !== null)
      .map(city => ({
        name: city.name,
        value: [...city.coordinates, city[selectedDataType.value]]
      }))

    map.value.setOption({
      series: [
        {
          data: seriesData
        },
        {
          data: seriesData
        }
      ]
    })

    if (seriesData.length > 0) {
      message.success('数据更新成功')
    } else {
      message.warning('暂无可用数据')
    }
  } catch (error) {
    console.error('Error updating map data:', error)
    message.error('数据更新失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  await updateMapData()
}

// 城市天气图表配置
const cityWeatherChartOption = computed(() => {
  if (!cityWeatherData.value.length) return {}

  const times = cityWeatherData.value.map(item => item.time)
  const temperatures = cityWeatherData.value.map(item => item.temperature)
  const humidities = cityWeatherData.value.map(item => item.humidity)
  const pressures = cityWeatherData.value.map(item => item.pressure)

  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach(param => {
          const value = param.value
          let unit = ''
          switch(param.seriesName) {
            case '温度':
              unit = '°C'
              break
            case '湿度':
              unit = '%'
              break
            case '气压':
              unit = 'hPa'
              break
          }
          result += `${param.marker} ${param.seriesName}: ${value}${unit}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['温度', '湿度', '气压']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: {
        formatter: (value) => {
          if (selectedTime.value === 'current') return value
          if (selectedTime.value === '24h') return value.split(' ')[1]
          return value.split(' ')[0]
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '温度(°C)',
        position: 'left'
      },
      {
        type: 'value',
        name: '湿度(%)',
        position: 'right'
      },
      {
        type: 'value',
        name: '气压(hPa)',
        position: 'right',
        offset: 80
      }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        data: temperatures,
        yAxisIndex: 0,
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '湿度',
        type: 'line',
        data: humidities,
        yAxisIndex: 1,
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '气压',
        type: 'line',
        data: pressures,
        yAxisIndex: 2,
        smooth: true,
        itemStyle: {
          color: '#722ed1'
        }
      }
    ]
  }
})

onMounted(() => {
  initMap()
  updateMapData() // 初始化时加载数据
})
</script>

<style scoped>
.weather-map-container {
  @apply space-y-6;
}

.map-section {
  @apply relative;
}

.chart {
  height: 300px;
}

:deep(.ant-modal-body) {
  padding: 24px;
}
</style> 