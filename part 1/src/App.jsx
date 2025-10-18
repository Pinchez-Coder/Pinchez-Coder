import { useState } from "react";
import { Search } from "lucide-react";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "YOUR_API_KEY"; // 🔹 3e0b4bfca29a06e60e01dd325442ff0

  const handleSearch = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("City not found 😔");
      }

      const data = await response.json();

      setWeather({
        name: data.name,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌤 Weather App</h1>

      {/* Search Bar */}
      <div className="flex w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-lg">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="flex-grow px-4 py-3 bg-transparent outline-none text-white placeholder-gray-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-700 hover:bg-blue-800 px-4 flex items-center justify-center transition"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Status */}
      {loading && <p className="mt-6 text-lg animate-pulse">Fetching weather...</p>}
      {error && <p className="mt-6 text-red-200">{error}</p>}

      {/* Weather Card */}
      {weather && (
        <div className="mt-8 bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm text-center w-full max-w-sm">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="Weather icon"
            className="mx-auto"
          />
          <p className="text-5xl font-bold">{Math.round(weather.temp)}°C</p>
          <p className="capitalize text-lg mt-1">{weather.condition}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-white/20 p-3 rounded-lg">
              <p className="font-semibold">Feels Like</p>
              <p>{Math.round(weather.feelsLike)}°C</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <p className="font-semibold">Humidity</p>
              <p>{weather.humidity}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg col-span-2">
              <p className="font-semibold">Wind Speed</p>
              <p>{weather.wind} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
