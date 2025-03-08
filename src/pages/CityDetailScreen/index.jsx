import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate} from "react-router";
import Icon from "../../components/Icons";
import {format} from "date-fns"
import {tr} from "date-fns/locale"

// Assets
import cities from "../../assets/data/cities.json";
import backIcon from "../../assets/backIcon.png";
import Graph from "../../components/Graphs";

const WeatherConditionDescriptions = {
  "clear sky": "Açık Gökyüzü",
  "few clouds": "Kısmen Güneşli",
  "scattered clouds": "Parçalı Bulutlu",
  "broken clouds": "Çok Bulutlu",
  "overcast clouds": "Kapalı Hava",
  "light rain": "Hafif Yağmurlu",
  "moderate rain": "Orta Şiddetli Yağmurlu",
  "heavy intensity rain": "Şiddetli Yağmurlu",
  "very heavy rain": "Çok Şiddetli Yağmurlu",
  "extreme rain": "Aşırı Yağmurlu",
  "freezing rain": "Dondurucu Yağmur",
  "light snow": "Hafif Kar Yağışı",
  "snow": "Kar Yağışı",
  "heavy snow": "Yoğun Kar Yağışı",
  "sleet": "Sulu Kar",
  "shower rain": "Sağanak Yağışlı",
  "thunderstorm": "Gök Gürültülü Fırtına",
  "thunderstorm with rain": "Yağmurlu Gök Gürültülü Fırtına",
  "mist": "Sisli",
  "fog": "Yoğun Sis",
  "haze": "Puslu",
  "dust": "Tozlu",
  "sand": "Kum Fırtınası",
  "smoke": "Dumanlı",
  "tornado": "Kasırga",
  "squalls": "Ani Rüzgarlar"
};


const CityDetailScreen = () => {
  let navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState("");

  const [groupedForecasts , setGroupedForecasts] = useState({});

  const COLORS = ['#00baf0', '#5637f4'];

  const [graphData , SetGraphData] = useState({
    sicaklik: [],
    saat:[],
    icon:[],
    havaDurumu:[],
    hissedilen:[],
    aciklama:[]
  })

  let { city } = useParams();

  const foundCity = cities.find((item) => item.plaka === parseInt(city));

  let APIkey = "OPENWEATHERMAP_API_KEY";




  useEffect(()=>{
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${foundCity.lat}&lon=${foundCity.lon}&appid=${APIkey}`)
        .then(res =>{
            if(res.ok && res.status ===200){
                return res.json()
            }
        })
        .then(data =>{

            const groupedForecasts = {};
        
            data.list.forEach(forecast => {
              const date = new Date(forecast.dt * 1000);
              const tarih = date.toLocaleDateString('tr-TR'); // YYYY-MM-DD formatında tarih al

              const forecastData = {
                saat: date.toLocaleTimeString('tr-TR'),
                sicaklik: (forecast.main.temp - 273.15).toFixed(2),
                hissedilen: (forecast.main.feels_like - 273.15).toFixed(2),
                nem: forecast.main.humidity,
                havaDurumu: forecast.weather[0].main,
                aciklama: forecast.weather[0].description,
                ruzgarHizi: forecast.wind.speed,
                icon: forecast.weather[0].icon
              };
              // Eğer gün daha önce eklenmemişse, boş bir dizi oluştur
              if (!groupedForecasts[tarih]) {
                groupedForecasts[tarih] = [];
              }
              // O günkü tahminler listesine yeni veriyi ekle
              groupedForecasts[tarih].push(forecastData);
            });
        
            // console.log('Günlük Tahminler:', groupedForecasts);

            setGroupedForecasts(groupedForecasts);
        })
        .catch(err => {
          console.log(err);
          return {} //(or [], or an empty return, or any return at all)
        })
  },[])

  const updateGraphData = (date) => {

    // Eğer tarih mevcutsa ve o tarihe ait veri varsa
    if (groupedForecasts[date] && groupedForecasts[date].length > 0) {
        // graphData'yı sıfırlıyoruz her gün için
        const parts = date.split("."); 
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const trdate = format(new Date(formattedDate), "eeee", { locale: tr });
        setSelectedDay(trdate);
        SetGraphData({
            sicaklik: [],
            saat: [],
            icon: [],
            havaDurumu: [],
            hissedilen:[],
            aciklama:[]
        });

        // Yeni verileri ekliyoruz
        groupedForecasts[date].forEach(forecastData => {
            SetGraphData(prevData => ({
                sicaklik: [...prevData.sicaklik, parseInt(forecastData.sicaklik)], // sıcaklık verisini ekliyoruz
                saat: [...prevData.saat, forecastData.saat], // saati ekliyoruz
                icon: [...prevData.icon, forecastData.icon], // iconu ekliyoruz
                havaDurumu: [...prevData.havaDurumu, forecastData.havaDurumu], // hava durumu açıklamasını ekliyoruz
                hissedilen: [...prevData.hissedilen, forecastData.hissedilen],
                aciklama:[...prevData.aciklama, forecastData.aciklama]
            }));
          });
      } else {
          console.error(`No data available for the date: ${date}`);
      }
  };


  useEffect(() => {
    const date = new Date().toLocaleDateString('tr-TR');
    updateGraphData(date); // Bugün için veriyi güncelle
}, [groupedForecasts]);

  return (
    <>
        <header className="h-16 w-full bg-black/40 flex flex-row justify-between items-center px-6">
            <div>
                <NavLink
                    onClick={()=> navigate(-1)}
                >
                    <img src={backIcon} className="w-10 h-10" alt="" />
                </NavLink>
            </div>
            <div className="text-2xl font-bold tracking-wide">
                5 GÜNLÜK HAVA DURUMU
            </div>
            <div>
               
            </div>
        </header>
        <div>
          <section className="h-140 w-full flex flex-row justify-center items-center">
              <Graph 
                data={graphData.sicaklik} 
                colors={COLORS} 
                range={[-20, 60]} 
                labels={graphData.saat} 
                title={`${parseInt(graphData.sicaklik[0])}°C`} 
                subtitle={`${parseInt(graphData.hissedilen)}°C`} 
                legend={foundCity.il_adi} 
                day={selectedDay}
                WeatherCondition={WeatherConditionDescriptions[graphData.aciklama.shift(0)]}
                icon={graphData.icon.shift(0)}
              />
          </section>
          <section className="flex flex-row gap-4 py-4 justify-center">
          {Object.keys(groupedForecasts).map(date => ( () => {
            const parts = date.split("."); 
            const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            const trdate = format(new Date(formattedDate), "eeee", { locale: tr });

            return(
              <div key={date} className="border w-64 h-64  items-center border-white rounded hover:bg-black/40 cursor-pointer">
              {groupedForecasts[date][0] && ( // Eğer o gün için veri varsa ilk tahmini göster
                <a onClick={() =>{updateGraphData(date)}} className="text-center w-64 h-64 flex flex-col justify-between py-4">
                  <h3 className="font-bold text-lg">{trdate}</h3>
                  <div className="w-full flex justify-center items-center"><Icon icon={groupedForecasts[date][0].icon}/></div>
                  <h2 className="text-lg font-semibold text-white">
                    {parseInt(groupedForecasts[date][0].sicaklik)}°C <span className="text-white/40 text-base ml-4">{parseInt(groupedForecasts[date][0].hissedilen)}°C</span> 
                  </h2>
                </a>
              )}
            </div>
            )
          })())}
          </section>
        </div>
    </>
  );
};

export default CityDetailScreen;