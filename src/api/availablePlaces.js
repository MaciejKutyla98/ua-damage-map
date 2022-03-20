export const fetchAvailablePlaces = ({
  searchText,
  minLon, maxLon, minLat, maxLat
}) => {
  const url = `https://ua-damage-map-api-prod.herokuapp.com/damage-report/available-place?searchText=${searchText}&minLon=${minLon}&maxLon=${maxLon}&minLat=${minLat}&maxLat=${maxLat}`
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .catch(error => console.log(error));
}