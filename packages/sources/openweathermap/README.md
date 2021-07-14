# Chainlink External Adapter for OpenWeatherMap

Adapter to get data from [OpenWeatherMap](https://openweathermap.org/).

### Environment Variables

| Required? |  Name   |                                                        Description                                                         | Options | Defaults to |
| :-------: | :-----: | :------------------------------------------------------------------------------------------------------------------------: | :-----: | :---------: |
|     ✅     | API_KEY | An API key that can be obtained [here](https://openweathermap.org/price) |         |             |

---

### Input Parameters

| Required? |   Name   |     Description     |           Options            | Defaults to |
| :-------: | :------: | :-----------------: | :--------------------------: | :---------: |
|           | endpoint | The endpoint to use | [current-city](#Current-City-Endpoint) |   example   |

---

## Current City Endpoint

Query the current temperature of any city

### Input Params

| Required? |   Name   |               Description                |       Options       | Defaults to |
| :-------: | :------: | :--------------------------------------: | :-----------------: | :---------: |
|    ✅     | `city`   | The city name, or city name and state code, or city name and state code and country code. Divide the param info with comma, and refer to [ISO 3166](https://www.iso.org/obp/ui/#search) for the state codes or country codes |  |             |
|           | `units`  | The units of measurement | `standard` (K), `metric` (°C), `imperial` (°F). The API defaults any invalid value to `standard` | `standard`  |

### Sample Input

Current temperature of Bristol (US) in Kelvin:

```json
{
  "id": "1",
  "data": {
    "city": "bristol",
  }
}
```

Current temperature of Bristol (GB) in degrees Celsius:

```json
{
  "id": "1",
  "data": {
    "city": "bristol,gb",
    "units": "metric",
  }
}
```

### Sample Output

Successful response:

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "result": 291.27
  },
  "statusCode": 200
}
```

Unsuccessful response:

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "status": "errored",
  "error": {
    "name": "AdapterError",
    "message": "Request failed with status code 404"
  },
  "statusCode": 500
}
```
