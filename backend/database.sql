-- 创建数据库
CREATE DATABASE IF NOT EXISTS weather_app DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE weather_app;

-- 创建城市表
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_city (name, country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建天气数据表
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity INT NOT NULL,
    pressure INT NOT NULL,
    wind_speed DECIMAL(5, 2) NOT NULL,
    wind_direction INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    weather_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入一些热门城市数据
INSERT INTO cities (name, country, latitude, longitude) VALUES
('北京', 'CN', 39.9042, 116.4074),
('上海', 'CN', 31.2304, 121.4737),
('广州', 'CN', 23.1291, 113.2644),
('深圳', 'CN', 22.5431, 114.0579),
('杭州', 'CN', 30.2741, 120.1551)
ON DUPLICATE KEY UPDATE
latitude = VALUES(latitude),
longitude = VALUES(longitude);

-- 创建索引
CREATE INDEX idx_city_name ON cities(name);
CREATE INDEX idx_weather_city ON weather_data(city_id);
CREATE INDEX idx_weather_created ON weather_data(created_at); 