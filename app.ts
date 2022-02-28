import express, { Request, Response, NextFunction } from "express"
import bodyParser from "body-parser"

const app = express()
const port = 3000

app.use(bodyParser.json())

interface LocationWithTimezone {
    id?: string
    location: string
    timezoneName: string
    timezoneAbbr: string
    utcOffset: number
};

const locations: LocationWithTimezone[] = [
    {
        id: "1",
        location: 'Germany',
        timezoneName: 'Central European Time',
        timezoneAbbr: 'CET',
        utcOffset: 1
    },
    {
        id: "2",
        location: 'China',
        timezoneName: 'China Standard Time',
        timezoneAbbr: 'CST',
        utcOffset: 8
    },
    {
        id: "3",
        location: 'Argentina',
        timezoneName: 'Argentina Time',
        timezoneAbbr: 'ART',
        utcOffset: -3
    },
    {
        id: "4",
        location: 'Japan',
        timezoneName: 'Japan Standard Time',
        timezoneAbbr: 'JST',
        utcOffset: 9
    }
];

app.get("/timezones", (req: Request, response: Response, next: NextFunction) => {
    response.status(200).json(locations)
})

app.get("/timezones/:id", (req: Request<{ id: string }>, response: Response, next: NextFunction) => {
    const location = locations.find(loc => loc.id === req.params.id)
    if (location) {
        response.status(200).json(location)
    }
    else {
        response.status(404)
    }
})

app.post("/timezones", (req: Request<any, LocationWithTimezone[], { timezone: Omit<LocationWithTimezone, "id"> }>, res: Response<LocationWithTimezone[]>, next: NextFunction) => {
    const { timezone } = req.body
    locations.push({ ...timezone, id: String(locations.length + 1) })
    res.status(200).json(locations)
})

app.put("/timezones/:id", (req: Request<{ id: string }, LocationWithTimezone[], { timezone: Partial<LocationWithTimezone> }>, res: Response<LocationWithTimezone[]| string>, next: NextFunction) => {
    const { id } = req.params
    const { timezone } = req.body
    const locationIndex = locations.findIndex(loc => loc.id === id)
    if (locationIndex > -1) {
        locations[locationIndex] = {
            ...locations[locationIndex],
            ...timezone
        }
        res.status(200).json(locations)
    }
    else {
        res.status(404).json("Not found")
    }
})

app.delete("/timezones/:id", (req: Request, response: Response, next: NextFunction) => {
    const locationIndex = locations.findIndex(loc => loc.id === req.params.id)
    if (locationIndex > -1) {
        locations.splice(locationIndex, 1)
        response.status(200).json(locations)
    }
    else {
        response.status(404).json("Not found")
    }
})

app.listen(port, () => {
    console.log(`Timezones app is running on port ${port}`)
});