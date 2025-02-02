import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function App() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [showPopup, setShowPopup] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState("Europe/Tallinn");
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const timezones = [
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "Europe/Tallinn",
    "Asia/Dubai", "Asia/Jakarta", "Asia/Karachi", "Asia/Riyadh", "Asia/Kuala_Lumpur"
  ];

  const countries = { "London": "UK", "Paris": "France", "Berlin": "Germany", "Moscow": "Russia", "Tallinn": "Estonia", "Dubai": "UAE", "Jakarta": "Indonesia", "Karachi": "Pakistan", "Riyadh": "Saudi Arabia", "Kuala Lumpur": "Malaysia" };

  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchPrayerTimes = async (city, country, date) => {
      try {
        const dateString = formatDate(date); //DD-MM-YYYY format
        const url = `${import.meta.env.VITE_PRAYER_API_URL}/v1/timingsByCity?city=${city}&country=${country}&date=${dateString}`;
        const response = await fetch(url);
        const data = await response.json();
        setPrayerTimes(data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setLoading(false);
      }
    };
    const getUserLocation = () => {
      const { city, country } = location;
      fetchPrayerTimes(city, country, selectedDate);
    };

    getUserLocation();

  }, [location, selectedDate]);

  const handleTimezoneChange = (event) => {
    const city = event.target.value.split("/")[1].replace("_", " ");
    setLocation({ city, country: countries[city] });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locationResponse = await fetch(
            `${import.meta.env.VITE_LOCATION_API_URL}?format=json&lat=${latitude}&lon=${longitude}`
          );
          const locationData = await locationResponse.json();
          const city = locationData.address.city || locationData.address.town || "Unknown";
          const country = locationData.address.country || "Unknown";
          setLocation({ city, country });
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const confirm = () => {
    setShowPopup(false)
  };

  const handlePayment = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openInvoice({
        description: "Prayer Times Subscription",
        payload: "subscription_1_month",
        provider_token: import.meta.env.VITE_PROVIDER_TOKEN, // Use provider token from env
        currency: "RUB",
        prices: [{ label: "1 Month Subscription", amount: 50000 }],
        start_param: "subscription"
      }, (success) => {
        if (success) {
          setIsPaidUser(true);
          localStorage.setItem("isPaidUser", "true");
        } else {
          alert("Payment failed, please try again.");
        }
      });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center islamic-pattern">
      <h1 className="text-xl font-bold">
        <i className="fas fa-moon"></i> Prayer Times
      </h1>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        className="react-calendar"
      />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold islamic-text">Confirm Your Location</h2>
           {!location.city ?  <p>Loading...</p> :
            <p>{location.city}, {location.country}</p>
           }
            <p>or select your timezone:</p>
            <select className="mr-1 p-2 border rounded btn-green" value={selectedTimezone} onChange={handleTimezoneChange}>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-blue-500 text-white rounded btn-green" onClick={confirm}>Confirm</button>
          </div>
        </div>
      )}
      <p className="islamic-text">Location: {location.city}, {location.country}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mt-4">
          {prayerTimes && Object.entries(prayerTimes).map(([name, time]) => (
            <li key={name}>
              <strong>{name}:</strong> {time}
            </li>
          ))}
        </ul>
      )}
      {!isPaidUser && !isTrialActive && (
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded btn-green" onClick={handlePayment}>
          Subscribe for 500 RUB/month
        </button>
      )}
      {isTrialActive && <p className="text-green-500 mt-4 ">You are in a free trial period!</p>}
    </div>
  );
}
