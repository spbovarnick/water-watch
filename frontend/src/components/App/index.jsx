import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBar from '../NavBar'
import Footer from '../Footer'
import Card from '../Card'


function App() {
  const [riverData, setRiverData] = useState([])
  

  const getData = async (string) => {
    try {
      const res = await axios.get(string)
      const {data} = res
      // console.log(data.value.timeSeries[0].values[0].value[0].value)
      // console.log(data.value.timeSeries[1].values[0].value[0].value)
      // console.log(data.value.timeSeries[2].values[0].value[0].value)
      // console.log(data.value.timeSeries[3].values[0].value[0].value)
      return data

    } catch (error) {
      console.log(error)
    }
  }

  let staticGaugeHeights = [
    {   
        name: "Sandy River",
        goodLow: 8.5,
        goodHigh: 9,
        perfectHigh: 10.5,
        highHigh: 11,
        tooHighHigh: 15,
    },
    {
        name: "Wilson River",
        goodLow: 3.5,
        goodHigh: 4.8,
        perfectHigh: 5.4,
        highHigh: 6.5,
        tooHighHigh: 10.5,
    },
    {
        name: "Clackamas River",
        goodLow: 8,
        goodHigh: 10,
        perfectHigh: 13,
        highHigh: 15,
        tooHighHigh: 18,
    }
  ]

  useEffect(() => {
  getData("https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=14142500,%2014301500,%2014210000&parameterCd=00060,00065&siteStatus=all")
    .then((res) => {
      let arr = []
      for (let i = 0; i < res.value.timeSeries.length; i += 1) {
        // a bunch of logic to get the rivery name capitalized from the object's "siteName" key
        let nameVar = res.value.timeSeries[i].sourceInfo.siteName.toLowerCase()
        const index = nameVar.indexOf("river")
        let name = nameVar.slice(0, index + 5).split(" ")
        for (let x = 0; x < name.length; x++) {
          name[x] = name[x].charAt(0).toUpperCase() + name[x].substring(1)
        }
        name = name.join(" ")
        let goodLow, goodHigh, perfectHigh, highHigh, tooHighHigh
        staticGaugeHeights.forEach((q) => {
          if (q.name === name) {
            goodLow = q.goodLow
            goodHigh = q.goodHigh
            perfectHigh = q.perfectHigh
            highHigh = q.highHigh
            tooHighHigh = q.tooHighHigh
          }
        })
        arr.push( {
          "name": name,
          "siteName": res.value.timeSeries[i].sourceInfo.siteName,
          "latitude": res.value.timeSeries[i].sourceInfo.geoLocation.geogLocation.latitude,
          "longitude": res.value.timeSeries[i].sourceInfo.geoLocation.geogLocation.longitude,
          "flow": parseInt(res.value.timeSeries[i].values[0].value[0].value), 
          "height": parseInt(res.value.timeSeries[i += 1].values[0].value[0].value),
          "goodLow": goodLow,
          "goodHigh": goodHigh,
          "perfectHigh": perfectHigh,
          "highHigh": highHigh,
          "tooHighHigh": tooHighHigh
        },)
      }
      return arr
    })
      .then(res => setRiverData(res))
  }, [])

  console.log(riverData)

  let riverInfo = <p>River data loading...</p>
  if (Object.keys(riverData).length > 0){
      riverInfo = riverData
        .map((river, i) => 
          <Card 
            key={i}  
            riverData={river}
          />
        )
  }
    

  return (
    <>
      <NavBar />

      <div>
        {riverInfo}
      </div>      
      <Footer />
    </>
  )
}

export default App
