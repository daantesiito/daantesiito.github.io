
# FLTV scraper

futbol libre tv - node scraper

## Usage/Examples

```cmd
npm i @silent_m4gician/ftv-scraper
```

```javascript
const { getData } = require("@silent_m4gician/ftv-scraper");

const getMatches = async () =>{
  const matches = await getData()
  console.log(matches)
}

getMatches()
```

## Screenshots

![cmd terminal](https://i.gyazo.com/7ce2cbdd79511875bd45df367b593aa4.png)
![FTV page](https://i.gyazo.com/5a3c7222dbf13fbf5badb31e19fca467.png)
