import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import './Home.css';

interface City {
  city_name_en: string;
  city_name_he: string;
  city_code: number;
  region_code: number;
}

interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
  };
}

interface SearchHistory {
  time: string;
  city: string;
  country: string;
}

function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState('');

  // טעינת רשימת הערים
  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          'https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e&limit=2000'
        );
        
        if (!response.ok) {
          throw new Error('שגיאה בטעינת רשימת ערים');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success && data.result && data.result.records) {
          // סינון ערים בישראל בלבד - רק ערים עם שם אנגלית תקין
          const filteredCities = data.result.records.filter(
            (city: City) => {
              const enName = city.city_name_en ? city.city_name_en.trim() : '';
              const heName = city.city_name_he ? city.city_name_he.trim() : '';
              
              // בדיקה שיש שם עברית תקין
              if (!heName || heName === '') return false;
              
              // בדיקה שיש שם אנגלית תקין (לפחות 2 אותיות)
              if (!enName || enName.length < 2) return false;
              
              // בדיקה שהשם באנגלית מכיל אותיות אמיתיות (לא רק רווחים או תווים מיוחדים)
              if (!/[a-zA-Z]{2,}/.test(enName)) return false;
              
              // בדיקה שיש קודי זיהוי תקינים
              if (city.city_code <= 0 || city.region_code <= 0) return false;
              
              return true;
            }
          );
          setCities(filteredCities);
          console.log('Cities loaded:', filteredCities.length);
        } else {
          throw new Error('מבנה נתונים לא תקין');
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('שגיאה בטעינת רשימת ערים. אנא נסה שוב.');
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  // טעינת מזג אוויר
  async function fetchWeather(cityName: string) {
    setLoading(true);
    setError('');
    try {
      const apiKey = '31d063ce9c564d9d831133455230512';
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName},Israel`
      );
      
      if (!response.ok) {
        throw new Error('שגיאה בטעינת מזג אוויר');
      }
      
      const data = await response.json();
      
      // וידוא שהתוצאה היא מישראל בלבד
      if (data.location.country !== 'Israel') {
        throw new Error('נמצאה עיר מחוץ לישראל');
      }
      
      setWeather(data);
      
      // שמירת היסטוריה
      const history: SearchHistory[] = JSON.parse(
        localStorage.getItem('weatherHistory') || '[]'
      );
      const now = new Date();
      const timeString = `${now.toLocaleDateString('he-IL')} ${now.toLocaleTimeString('he-IL')}`;
      
      history.unshift({
        time: timeString,
        city: data.location.name,
        country: data.location.country,
      });
      
      localStorage.setItem('weatherHistory', JSON.stringify(history));
    } catch (err) {
      console.error('Weather API error:', err);
      setError('שגיאה בטעינת מזג אוויר. נא לבחור עיר אחרת.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleCityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
    if (city) {
      fetchWeather(city);
    }
  }

  return (
    <div className="page">
      <h1>מזג אוויר בישראל</h1>
      <Navigation />
      
      <div className="content">
        <div className="select-container">
          <label htmlFor="city-select">בחר יישוב:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={loading}
          >
            <option value="">-- בחר יישוב --</option>
            {cities.map((city) => (
              <option key={`${city.city_name_en}-${city.city_name_he}`} value={city.city_name_en}>
                {city.city_name_he}
              </option>
            ))}
          </select>
          {cities.length > 0 && (
            <p className="cities-count">נטענו {cities.length} ערים</p>
          )}
        </div>

        {loading && <p className="loading">טוען...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <img src={weather.current.condition.icon} alt="weather icon" />
            <h2>{weather.location.name}</h2>
            <p className="country">{weather.location.country}</p>
            <p className="temp">{weather.current.temp_c}°C</p>
            <p className="condition">{weather.current.condition.text}</p>
            <p className="wind">Wind Speed: {weather.current.wind_kph} kph</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
