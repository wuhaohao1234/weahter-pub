# 气象信息查询与分析系统

基于 OpenLayers 的气象信息查询与分析系统，使用 Vue 3 + OpenLayers + Ant Design Vue + Tailwind CSS 构建前端，Express.js 构建后端。

## 功能特点

- 基于 OpenLayers 的地图显示
- 天气信息热力图展示
- 城市天气查询
- 实时天气数据更新
- 响应式设计

## 技术栈

### 前端
- Vue 3
- OpenLayers
- Ant Design Vue
- Tailwind CSS
- Axios

### 后端
- Express.js
- MySQL
- Sequelize ORM
- OpenWeatherMap API

## 安装说明

### 前端设置

```bash
cd frontend
npm install
npm run dev
```

### 后端设置

1. 安装 MySQL 并确保服务已启动
2. 创建数据库：
   ```sql
   CREATE DATABASE weather_app;
   ```
3. 在 backend 目录下创建 .env 文件并配置以下内容：
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=weather_app
   OPENWEATHER_API_KEY=your_api_key_here
   ```
4. 安装依赖并启动服务器：
   ```bash
   cd backend
   npm install
   node server.js
   ```

## 使用说明

1. 访问 http://localhost:5173 打开前端应用
2. 在搜索框中输入城市名称进行天气查询
3. 选择天气类型（温度、湿度、气压）来更新热力图
4. 地图上会显示相应城市的热力图数据

## 注意事项

- 使用前请确保已获取 OpenWeatherMap API 密钥
- 确保 MySQL 服务已启动
- 确保已创建数据库并正确配置数据库连接信息
- 前端默认运行在 5173 端口，后端运行在 3000 端口 