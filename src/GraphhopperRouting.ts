export interface Args {
    points: [number, number][],
    key: string,
    host?: string,
    basePath?: string,
    vehicle?: string
    data_type?: string
    locale?: string
    debug?: boolean
    points_encoded?: boolean
    instructions?: boolean
    elevation?: boolean
    optimize?: boolean
}

interface Options {
    points: [number, number][],
    key: string
    vehicle: string
    locale: string
    debug: boolean
    points_encoded: boolean
    instructions: boolean
    elevation: boolean
    optimize: boolean

    [index: string]: string | boolean | [number, number] []
}



function copyOptions(args: Args): Options {

    const opt: Options = {
        vehicle: 'car',
        points_encoded: true,
        optimize: true,
        locale: 'en',
        instructions: true,
        elevation: false,
        debug: false,
        points: args.points,
        key: args.key,
    }

    // this is ugly but I couldn't find a more elegant way quickly
    if (args.vehicle)
        opt.vehicle = args.vehicle
    if (args.points_encoded !== undefined)
        opt.points_encoded = args.points_encoded
    if (args.optimize !== undefined)
        opt.optimize = args.optimize
    if (args.locale !== undefined)
        opt.locale = args.locale
    if (args.instructions !== undefined)
        opt.instructions = args.instructions
    if (args.elevation !== undefined)
        opt.elevation = args.elevation
    if (args.debug !== undefined)
        opt.debug = args.debug

    return opt
}

function createPointParams(points: [number, number][]): [string, string][] {

    return points.map(point => ["point", encodeURIComponent(point[0] + ',' + point[1])])
}

function createURL(host = 'https://graphhopper.com/api/1', basePath = "/routing", options: Options) {

    const url = new URL(host + basePath)

    for (const key in Object.keys(options)) {
        const value = options[key]

        if (key === 'points') {
            const points = value as [number, number][]
            const params = createPointParams(points).forEach(param => url.searchParams.append(param[0], param[1]))
        } else {
            url.searchParams.append(key, encodeURIComponent((value as string | boolean))) // point are already filtered
        }
    }

    return url
}

function decodePath(encoded: any, is3D: any): number[][] {
    const len = encoded.length;
    let index = 0;
    const array = [];
    let lat = 0;
    let lng = 0;
    let ele = 0;

    while (index < len) {
        let b;
        let shift = 0;
        let result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLon;

        if (is3D) {
            // elevation
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaEle = ((result & 1) ? ~(result >> 1) : (result >> 1));
            ele += deltaEle;
            array.push([lng * 1e-5, lat * 1e-5, ele / 100]);
        } else
            array.push([lng * 1e-5, lat * 1e-5]);
    }
    // var end = new Date().getTime();
    // console.log("decoded " + len + " coordinates in " + ((end - start) / 1000) + "s");
    return array;
}

export async function doRequest(args: Args): Promise<any> {

    const options = copyOptions(args);
    const url = createURL(args.host, args.basePath, options)

    const response = await fetch(url.toString(), {
        headers: {
            'Accept': args.data_type ? args.data_type : 'application/json',
        },
        mode: 'cors',
    })

    if (response.ok) {
        const result = await response.json()
        result.paths.forEach((path: any) => {

            // convert encoded polyline to geojson
            if (path.points_encoded) {
                path.points = {
                    type: 'LineString',
                    coordinates: decodePath(path.ponints, options.elevation)
                }
                path.snapped_waypoints = {
                    type: "LineString",
                    coordinates: decodePath(path.snapped_waypoints, options.elevation)
                }
            }
            if (path.instructions) {
                for (let i = 0; i < path.instructions.length; i++) {
                    const interval = path.instructions[i].interval
                    path.instructions[i].points = path.points.coordinates.slice([interval[0], interval[1] + 1])
                }
            }
        })
        return result
    } else {
        // original code has GHUTIL.extracterrors
        throw Error('something went wrong ')
    }
}

