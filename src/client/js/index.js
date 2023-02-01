//cards
const main = document.getElementById('main')
const planner = document.getElementById('planner')
const result = document.getElementById('result')

//buttons 

const printBtn = document.getElementById('print')
const deleteBtn = document.getElementById('delete')
const addTripBtn = document.querySelector('.addButton')
const goback = document.querySelector('.goBack')

//form
const form = document.getElementById('form')
const submitTrip = document.getElementById('submitTrip')
const departure = document.querySelector('input[name= "from"]')
const destination = document.querySelector('input[name= "to"]')
const date = document.querySelector('input[name= "date"]')

//api's
//GeoNames 
const username = 'norahsa'
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
//weatherbit
const weatherbitapikey ="f75aaa41a76946b8a63d507a69725dc0"
//https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
const weatherbitforecast = "http://api.weatherbit.io/v2.0/forecast/daily?"
//https://api.weatherbit.io/v2.0/history/daily?postal_code=27601&country=US&start_date=2023-01-20&end_date=2023-01-21&key=API_KEY
const weatherbithistory = 'http://api.weatherbit.io/v2.0/history/daily?'
//Pixabay 
const PixabayUrl = "https://pixabay.com/api/?key="
const Pixabayapikey = "33081497-5b2001bc4eb3434f26dd72828"
const tripInfo = {}

//function add trip

addTripBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    planner.style.display = "block"
    main.style.display = "none"
    
})
goback.addEventListener('click', (e)=>{
    e.preventDefault()
    planner.style.display = "none"
    main.style.display = "block"
    
})

function days(date){
    let d1 = new Date(date)
    let d2 = new Date()
    return Math.floor((Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) - Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())) / (1000 * 60 * 60 * 24))
}
const addTripfunction = (e)=>{
    e.preventDefault()


    tripInfo['from'] = document.getElementById('fromInput').value
    tripInfo['to'] = document.getElementById('toInput').value
    tripInfo['date'] = document.getElementById('dateInput').value
    tripInfo['daystogo'] = days(tripInfo['date'])

    try{
        getCity(tripInfo['to'])
        .then((toData)=>{
            const cityLat = toData.geonames[0].lat
            const cityLng = toData.geonames[0].lng
            return getWeather(cityLat, cityLng, tripInfo['date'])

        }).then((weatherData) => {
            tripInfo['temp'] = weatherData['data'][0]['temp']
            tripInfo['summary'] = weatherData['data'][0]['weather']['description']
            return getImage(tripInfo['to'])

        }).then((imageData) => {

            if(imageData['hits'].length > 0){
                tripInfo['cityImage'] = imageData['hits'][0]['webformatURL']
            }
            return postData(tripInfo)
        }).then((data) => {
            UpdateUI(data)
            console.log(data)
        })
    }catch(error){
        console.log('error:', error)
    }

}

// city informaiton
export const getCity = async(to) =>{
    const res = await fetch(geoNamesURL + to + "&maxRows=10&" + "username=" + username)

    try{
        const cityInfo = await res.json()
        return cityInfo
    }catch(error){
        console.log('error: ', error)
    }
}

// weather information

export const getWeather = async(cityLat, cityLong, date) =>{
    
    const timestamp_tripDate = Math.floor(new Date(date).getTime() / 1000)

    const todayDate = new Date()
    const timestamp_today = Math.floor(new Date(todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()).getTime() / 1000);
    let res

    if(timestamp_tripDate < timestamp_today){
        let nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)

        res = await fetch (weatherbithistory + "lat=" + cityLat + "&lon=" + cityLong + "&start_date=" + date + '&end_date=' + nextDate + '&key=' + weatherbitapikey) 
    }
    else{
        res = await fetch (weatherbitforecast + "lat=" + cityLat + '&lon=' + cityLong + '&key=' + weatherbitapikey) 
    }

    try{
        return await res.json()
    } catch(error){
        console.log('error: ', error)
    }
    console.log(res)
}
// image information

export const getImage = async(toCity) => {

    const res = await fetch(PixabayUrl + Pixabayapikey + "&q=" + toCity + " city&image_type=photo")

    try{
        return await res.json()
    }catch(error){
        console.log('error' , error)
    }
}

//post 

export const postData = async(data) =>{
    const req = await fetch('http://localhost:8081/add', {
        method:"POST",
        credentials: "same-origin",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
        
    })
    try{
        const userData = await req.json()
        return userData
    }catch(error){
        console.log('error:', error)
    }
}

export const UpdateUI =  (data) =>{
    
    result.classList.remove("invisible")
    result.scrollIntoView({behavior: 'smooth'})

    document.getElementById('departure').innerHTML = data.from
    document.getElementById('destination').innerHTML = data.to
    document.getElementById('date').innerHTML = data.date
    document.getElementById('temp').innerHTML = data.temp 
    document.getElementById('summary').innerHTML = data.summary
    
    if(data.cityImage != undefined){
        document.getElementById('pixabayImage').setAttribute('src', data.cityImage)
    }
    if(data.daystogo < 0 ){
        alert('You have been to this trip ')
    }
    else{
        document.getElementById('numberOfDays').innerHTML = data.daystogo
    }

}

submitTrip.addEventListener('click', addTripfunction)


export {addTripfunction}