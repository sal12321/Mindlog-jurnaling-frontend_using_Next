"use client";
import { useState } from "react";
import { getWeather } from "../../lib/api";
import Navbar from "../Navbar";
import { ClipLoader } from "react-spinners";

export default function WeatherPage() {
  const [city, setCity] = useState("Jharkhand");
  const [data, setData] = useState(null); // You renamed this to response
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchWeather() {
    setLoading(true);
    setError("");
    setData(null);

    await getWeather(city).then((res) => {
      if (res.ok) {
        setLoading(false);
        setData(res); // FIX 2: Changed from setData(res) to setResponse(res)
      } else {
        setError("city not found");
      }
    });
  }

  const c = data?.data?.data?.current;
  const l = data?.data?.data?.location;
  const hit = data?.data?.hit;
  const latency = data?.data?.durationMs;

  return (
    <>
      <Navbar />

      <div className="container">
        <a href="/journal"> ← Journal </a>
        <h1>Weather</h1>
        <div className="form-group" style={{ flexDirection: "row", gap: 8 }}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button className="btn" onClick={fetchWeather}>
            Get Weather
          </button>
        </div>

        {error && !loading && <div className="error">{error}</div>}

        {loading && !error && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <ClipLoader color="#2563eb" size={45} />
          </div>
        )}

        {c && l && (
          <div className="entry-card" style={{ marginTop: 16 }}>
            <h2>
              {l.name}, {l.country}
            </h2>
            <p>{c.weather_descriptions?.[0]}</p>
            <p>
              Temperature: {c.temperature}°C (feels like {c.feelslike}°C)
            </p>
            <p>
              Wind: {c.wind_speed} km/h {c.wind_dir}
            </p>
            <p>Humidity: {c.humidity}%</p>
            {typeof latency === "number" && latency > 0 ? (
              <p style={{ fontSize: "15px", color: "gray", marginTop: "8px" }}>
               <strong>Caching : REDIS</strong> |  Latency: {latency}ms | Cache Hit: {String(hit)} 
              </p>
            ) : (
              <span
                style={{ fontSize: "15px", color: "gray", marginTop: "8px" }}
              >
                Data stored in cache
              </span>
              

            
            )}
            
          </div>
        )}
      </div>
    </>
  );
}
