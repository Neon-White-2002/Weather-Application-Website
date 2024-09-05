const Wrapper = document.querySelector(".Wrapper"),

Input_Part = Wrapper.querySelector(".Input-Part"),
Arrow_Back = Wrapper.querySelector("header i"),

Info_Text = Input_Part.querySelector(".Info-Text"),
Input_Feild = Input_Part.querySelector("input"),
Loation_Btn = Input_Part.querySelector("button"),

Weather_Image = document.querySelector(".weather-part img");

// #API - KEY FOR 'OPEN - WEATHER -APP': -
let API_Key = "API-KEY";
let API;

// #USING THIS, BUTTON WE CAN NAVIGATE: -
Arrow_Back.addEventListener("click", () =>
{
    Wrapper.classList.remove("Active");
    Input_Feild.value = "";
});

// #THIS, HELP US GET THE 'CITY' NAME: -
Input_Feild.addEventListener("keyup", E => 
{
    if (E.key == "Enter" && Input_Feild.value != "")
    {
        Request_API(Input_Feild.value);
    }
});

// #USING LOCATION - BTN HELP, US TO FINF THE 'CURRENT - LOCATION' OF USER: -
Loation_Btn.onclick = () =>
{
    if (navigator.geolocation) // #IF 'BROWSER' SUPPORT GEO-LOCATION API
    {
        navigator.geolocation.getCurrentPosition(OnSuccess, OnError);
    }
    else
    {
        alert("Not, Support API");
    }
}

// #USING THIS FUNCTION (ONSUCCESS), WE CAN GET USER 'CURRENT - LOCATION' AND PASS TO WEB-SITE: -
function OnSuccess(Position)
{
    // #GETTING THE 'USER - CURRENT - LOCATION'
    Info_Text.innerHTML = "GETTING YOUR 'LIVE - LOCATION'...!";
    Info_Text.classList.add("Pending");

    const {latitude, longitude} = Position.coords;

    API = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_Key}`;
    Fetch_Data();

    //console.log(Position);
}

// #USING THIS FUNCTION(ONERROR), WE CAN DISPLAY 'ERROR - MSG' TO USER: -
function OnError(Error)
{
    Info_Text.innerHTML = Error.message.toUpperCase();
    Info_Text.classList.add("Error");
}

// #USING THIS FUNCTION (REQUEST_API), WE CAN FIND THE 'WEATHER' ACCORDING TO 'CITY': -
function Request_API(City)
{
    API = `https://api.openweathermap.org/data/2.5/weather?q=${City}&units=metric&appid=${API_Key}`;
    Fetch_Data();
}

// #THIS FUNCTION (FETCH_DATA), HELP US TO FIND THE EVERY DETAIL'S OF WEATHER: - 
function Fetch_Data()
{
    Info_Text.innerHTML = "GETTING WEATHER DETAIL'S...!";
    Info_Text.classList.add("Pending");

    fetch(API).then(Response => Response.json()).then(Result => Weather_Details(Result));
}

// #THIS FUNCTION (WEATHER_DETAIL'S), HELP US TO PASS THE INFORMATION 'HTML - ELEMENTS': -
function Weather_Details(Info)
{
    Info_Text.classList.replace("Pending", "Error");
    if (Info.cod =='404')
    {
        Info_Text.innerHTML = `'${Input_Feild.value.toUpperCase()}', ISN'T A VAILD 'CITY-NAME'...!`;
    }
    else
    {
        // #GETTING REQUIRED INFORMATION FROM 'INFO': -
        const city = Info.name;
        const country = Info.sys.country;
        const {description, id} = Info.weather[0];
        const {feels_like, humidity, temp} = Info.main;

        // #USING 'ID' WE CAN SET THE 'WEATHER - IMAGE' ACCORDING TO THEM: -
        if (id == 800)
        {
            Weather_Image.src = "IMAGES/clear.svg";
        }
        else if (id >= 200 && id <= 232)
        {
            Weather_Image.src = "IMAGES/storm.svg";
        }
        else if (id >= 600 && id <= 622)
        {
            Weather_Image.src = "IMAGES/snow.svg";
        }
        else if (id >= 701 && id <= 781)
        {
            Weather_Image.src = "IMAGES/haze.svg";
        }
        else if (id >= 801 && id <= 804)
        {
            Weather_Image.src = "IMAGES/cloud.svg";
        }
        else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531))
        {
            Weather_Image.src = "IMAGES/rain.svg";
        }

        // #NOW PASSING THE ABOVE VALUES IN 'HTML - ELEMENT': -
        Wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
        Wrapper.querySelector(".weather").innerHTML = description.toUpperCase();
        Wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
        Wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
        Wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;

        Info_Text.classList.remove("Pending", "Error");
        Wrapper.classList.add("Active");

        console.log(Info);
    }
}
