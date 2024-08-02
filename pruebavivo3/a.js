import { getData } from "@silent_m4gician/ftv-scraper"

const getMatches = async () =>{
  const matches = await getData()
  console.log(matches)
}

getMatches()