export const fetchData = () => {
    const url = 'https://ua-damage-map-api-prod.herokuapp.com/damage-report'
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