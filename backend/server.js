const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接配置
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'weather_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 转换天气代码为描述和图标
const weatherCodes = {
  0: { description: '晴朗', icon: '☀️' },
  1: { description: '多云', icon: '⛅' },
  2: { description: '阴天', icon: '☁️' },
  3: { description: '阴天', icon: '☁️' },
  45: { description: '雾', icon: '🌫️' },
  48: { description: '霾', icon: '🌫️' },
  51: { description: '轻雾', icon: '🌫️' },
  53: { description: '雾', icon: '🌫️' },
  55: { description: '浓雾', icon: '🌫️' },
  61: { description: '小雨', icon: '🌧️' },
  63: { description: '中雨', icon: '🌧️' },
  65: { description: '大雨', icon: '🌧️' },
  71: { description: '小雪', icon: '🌨️' },
  73: { description: '中雪', icon: '🌨️' },
  75: { description: '大雪', icon: '🌨️' },
  77: { description: '雪粒', icon: '🌨️' },
  80: { description: '阵雨', icon: '🌦️' },
  81: { description: '阵雨', icon: '🌦️' },
  82: { description: '阵雨', icon: '🌦️' },
  85: { description: '阵雪', icon: '🌨️' },
  86: { description: '阵雪', icon: '🌨️' },
  95: { description: '雷雨', icon: '⛈️' },
  96: { description: '雷阵雨', icon: '⛈️' },
  99: { description: '雷阵雨', icon: '⛈️' }
};

// API 路由
app.get('/api/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    // 首先从数据库查询城市信息
    const [cities] = await pool.execute(
      'SELECT * FROM cities WHERE name = ?',
      [city]
    );

    let cityData;
    if (cities.length === 0) {
      // 如果城市不在数据库中，从API获取
      const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`);
      
      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        return res.status(404).json({ error: '城市未找到' });
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];
      
      // 将城市信息保存到数据库
      const [result] = await pool.execute(
        'INSERT INTO cities (name, country, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, country, latitude, longitude]
      );
      
      cityData = {
        id: result.insertId,
        name,
        country,
        latitude,
        longitude
      };
    } else {
      cityData = cities[0];
    }
    
    // 获取天气数据
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`);
    
    const current = weatherResponse.data.current;
    const weatherCode = current.weather_code.toString();
    const weatherInfo = weatherCodes[weatherCode] || { description: '未知', icon: '❓' };
    
    const weatherData = {
      city: cityData.name,
      country: cityData.country,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      weatherCode,
      lat: cityData.latitude,
      lon: cityData.longitude
    };

    // 保存天气数据到数据库
    await pool.execute(
      'INSERT INTO weather_data (city_id, temperature, humidity, pressure, wind_speed, wind_direction, description, weather_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        cityData.id,
        weatherData.temperature,
        weatherData.humidity,
        weatherData.pressure,
        weatherData.windSpeed,
        weatherData.windDirection,
        weatherData.description,
        weatherData.weatherCode
      ]
    );

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取热门城市列表
app.get('/api/cities/popular', async (req, res) => {
  try {
    const [cities] = await pool.execute('SELECT name, country FROM cities ORDER BY created_at DESC LIMIT 5');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取天气统计信息
app.get('/api/weather/stats/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    // 首先从数据库查询城市信息
    const [cities] = await pool.execute(
      'SELECT * FROM cities WHERE name = ?',
      [city]
    );

    let cityData;
    if (cities.length === 0) {
      // 如果城市不在数据库中，从API获取
      const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`);
      
      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        return res.status(404).json({ error: '城市未找到' });
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];
      
      // 将城市信息保存到数据库
      const [result] = await pool.execute(
        'INSERT INTO cities (name, country, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, country, latitude, longitude]
      );
      
      cityData = {
        id: result.insertId,
        name,
        country,
        latitude,
        longitude
      };
    } else {
      cityData = cities[0];
    }

    // 获取天气数据
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&hourly=temperature_2m,relative_humidity_2m,pressure_msl&timezone=auto`
    );

    const hourlyData = weatherResponse.data.hourly;
    const temperatures = hourlyData.temperature_2m.slice(0, 24);
    const humidities = hourlyData.relative_humidity_2m.slice(0, 24);
    const pressures = hourlyData.pressure_msl.slice(0, 24);

    const stats = {
      avgTemperature: temperatures.reduce((acc, curr) => acc + curr, 0) / temperatures.length,
      maxTemperature: Math.max(...temperatures),
      minTemperature: Math.min(...temperatures),
      avgHumidity: humidities.reduce((acc, curr) => acc + curr, 0) / humidities.length,
      avgPressure: pressures.reduce((acc, curr) => acc + curr, 0) / pressures.length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取历史天气数据
app.get('/api/weather/history/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    // 首先从数据库查询城市信息
    const [cities] = await pool.execute(
      'SELECT * FROM cities WHERE name = ?',
      [city]
    );

    let cityData;
    if (cities.length === 0) {
      // 如果城市不在数据库中，从API获取
      const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`);
      
      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        return res.status(404).json({ error: '城市未找到' });
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];
      
      // 将城市信息保存到数据库
      const [result] = await pool.execute(
        'INSERT INTO cities (name, country, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, country, latitude, longitude]
      );
      
      cityData = {
        id: result.insertId,
        name,
        country,
        latitude,
        longitude
      };
    } else {
      cityData = cities[0];
    }

    // 获取历史天气数据
    const historyResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&hourly=temperature_2m,relative_humidity_2m,pressure_msl,weather_code&timezone=auto`
    );

    const hourlyData = historyResponse.data.hourly;
    const historyData = hourlyData.time.map((time, index) => {
      const weatherCode = hourlyData.weather_code[index].toString();
      const weatherInfo = weatherCodes[weatherCode] || { description: '未知', icon: '❓' };
      
      return {
        time: new Date(time).toLocaleTimeString(),
        temperature: hourlyData.temperature_2m[index],
        humidity: hourlyData.relative_humidity_2m[index],
        pressure: hourlyData.pressure_msl[index],
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        weatherCode
      };
    });

    res.json(historyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取天气预报数据
app.get('/api/weather/forecast/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    // 首先从数据库查询城市信息
    const [cities] = await pool.execute(
      'SELECT * FROM cities WHERE name = ?',
      [city]
    );

    let cityData;
    if (cities.length === 0) {
      // 如果城市不在数据库中，从API获取
      const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`);
      
      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        return res.status(404).json({ error: '城市未找到' });
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];
      
      // 将城市信息保存到数据库
      const [result] = await pool.execute(
        'INSERT INTO cities (name, country, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, country, latitude, longitude]
      );
      
      cityData = {
        id: result.insertId,
        name,
        country,
        latitude,
        longitude
      };
    } else {
      cityData = cities[0];
    }

    // 获取天气预报数据
    const forecastResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,pressure_msl_mean,weather_code&timezone=auto`
    );

    const dailyData = forecastResponse.data.daily;
    const forecastData = dailyData.time.map((date, index) => {
      const weatherCode = dailyData.weather_code[index].toString();
      const weatherInfo = weatherCodes[weatherCode] || { description: '未知', icon: '❓' };
      
      return {
        date: new Date(date).toLocaleDateString(),
        temperature: (dailyData.temperature_2m_max[index] + dailyData.temperature_2m_min[index]) / 2,
        humidity: dailyData.relative_humidity_2m_mean[index],
        pressure: dailyData.pressure_msl_mean[index],
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        weatherCode
      };
    });

    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 