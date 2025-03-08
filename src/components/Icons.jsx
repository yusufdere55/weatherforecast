import {
    WiDaySunny,
    WiDayCloudy,
    WiCloud,
    WiCloudy,
    WiShowers,
    WiDayShowers,
    WiThunderstorm,
    WiSnow,
    WiFog,
} from "weather-icons-react";

const iconMap = {
    "01d": { component: WiDaySunny, color: "#FFD700" }, // Sarı (güneşli)
    "02d": { component: WiDayCloudy, color: "#FFA500" }, // Turuncu (parçalı bulutlu)
    "03d": { component: WiCloud, color: "#A0A0A0" }, // Gri (bulutlu)
    "04d": { component: WiCloudy, color: "#808080" }, // Koyu gri (kapalı hava)
    "09d": { component: WiShowers, color: "#1E90FF" }, // Mavi (hafif yağmur)
    "10d": { component: WiDayShowers, color: "#00BFFF" }, // Açık mavi (yağmur)
    "11d": { component: WiThunderstorm, color: "#800080" }, // Mor (fırtına)
    "13d": { component: WiSnow, color: "#FFFFFF" }, // Beyaz (kar)
    "50d": { component: WiFog, color: "#D3D3D3" }, // Açık gri (sis)
    "01n": { component: WiDaySunny, color: "#FFD700" }, // Gece için de renk ayarı yapabilirsin
    "02n": { component: WiDayCloudy, color: "#FFA500" },
    "03n": { component: WiCloud, color: "#A0A0A0" },
    "04n": { component: WiCloudy, color: "#808080" },
    "09n": { component: WiShowers, color: "#1E90FF" },
    "10n": { component: WiDayShowers, color: "#00BFFF" },
    "11n": { component: WiThunderstorm, color: "#800080" },
    "13n": { component: WiSnow, color: "#FFFFFF" },
    "50n": { component: WiFog, color: "#D3D3D3" },
};

const Icon = ({ icon , size = 100}) => {
    const { component: WeatherIcon, color } = iconMap[icon] || { component: WiCloud, color: "#808080" }; // Varsayılan ikon ve renk

    return <WeatherIcon size={size} color={color} />;
};

export default Icon;
