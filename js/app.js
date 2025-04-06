// تكوين API
const API_KEY = 'ff25f6e242221186cc9d4f8803fb1437';
const DEFAULT_CITY = 'Algiers';

// عناصر DOM
const currentWeatherEl = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecastContainer');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');

// تحميل بيانات الطقس عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather(DEFAULT_CITY);
});

// البحث عن مدينة
searchBtn.addEventListener('click', searchWeather);
citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

function searchWeather() {
    const city = citySearch.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('الرجاء إدخال اسم المدينة');
    }
}

// جلب بيانات الطقس من API
async function fetchWeather(city) {
    try {
        currentWeatherEl.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> جاري جلب بيانات الطقس...
            </div>
        `;

        // جلب الطقس الحالي
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ar&appid=${API_KEY}`
        );
        
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentData = await currentResponse.json();

        // جلب توقعات الطقس
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ar&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        // عرض البيانات
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        currentWeatherEl.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في جلب بيانات الطقس. الرجاء التأكد من اسم المدينة والمحاولة مرة أخرى.</p>
            </div>
        `;
    }
}

// عرض الطقس الحالي
function displayCurrentWeather(data) {
    const weatherIcon = getWeatherIcon(data.weather[0].id);
    const windSpeed = (data.wind.speed * 3.6).toFixed(1); // تحويل إلى كم/س

    currentWeatherEl.innerHTML = `
        <div class="weather-info">
            <div>
                <div class="weather-city">${data.name}</div>
                <div class="weather-temp">${Math.round(data.main.temp)}°</div>
                <div class="weather-desc">${data.weather[0].description}</div>
            </div>
            <div class="weather-icon">
                <i class="fas ${weatherIcon}"></i>
            </div>
        </div>
        <div class="weather-details">
            <div><i class="fas fa-temperature-high"></i> العظمى: ${Math.round(data.main.temp_max)}°</div>
            <div><i class="fas fa-temperature-low"></i> الصغرى: ${Math.round(data.main.temp_min)}°</div>
            <div><i class="fas fa-wind"></i> سرعة الرياح: ${windSpeed} كم/س</div>
            <div><i class="fas fa-tint"></i> الرطوبة: ${data.main.humidity}%</div>
        </div>
    `;
}

// عرض توقعات الطقس
function displayForecast(data) {
    // تجميع البيانات حسب اليوم
    const dailyForecast = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('ar-EG', { weekday: 'long' });
        
        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min,
                weather: item.weather[0],
                icon: getWeatherIcon(item.weather[0].id)
            };
        } else {
            if (item.main.temp_max > dailyForecast[day].temp_max) {
                dailyForecast[day].temp_max = item.main.temp_max;
            }
            if (item.main.temp_min < dailyForecast[day].temp_min) {
                dailyForecast[day].temp_min = item.main.temp_min;
            }
        }
    });

    // عرض توقعات الأيام
    forecastContainer.innerHTML = '';
    Object.keys(dailyForecast).slice(0, 5).forEach(day => {
        const dayData = dailyForecast[day];
        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <h3>${day}</h3>
                <div class="forecast-icon">
                    <i class="fas ${dayData.icon}"></i>
                </div>
                <div class="forecast-temp">
                    <span>${Math.round(dayData.temp_max)}°</span> / 
                    <span>${Math.round(dayData.temp_min)}°</span>
                </div>
                <div class="forecast-desc">${dayData.weather.description}</div>
            </div>
        `;
    });
}

// وظائف مساعدة
function getWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return 'fa-bolt';
    if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain';
    if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy';
    if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake';
    if (weatherId >= 700 && weatherId < 800) return 'fa-smog';
    if (weatherId === 800) return 'fa-sun';
    if (weatherId > 800) return 'fa-cloud';
    return 'fa-cloud';
}