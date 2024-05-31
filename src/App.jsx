import './App.css'
import Display from "./Display.jsx";

function getAngle1(x0, y0, x1, y1, x2, y2) {
    return Math.atan2(y2 - y0, x2 - x0) - Math.atan2(y1 - y0, x1 - x0);
}

function getAngle2(x0, y0, x1, y1) {
    return Math.atan2(y1 - y0, x1 - x0);
}

function rotate(points, x0, y0, angleRad) {
    const s = Math.sin(angleRad);
    const c = Math.cos(angleRad);
    return points.map(([x, y]) => {
        const x1 = x - x0;
        const y1 = y - y0;
        const x2 = x1 * c - y1 * s;
        const y2 = y1 * c + x1 * s;
        return [x2 + x0, y2 + y0];
    });
}

function scale(points, x0, y0, f) {
    return points.map(([x, y]) => {
        return [(x - x0) * f + x0, (y - y0) * f + y0];
    });
}

function mirror(points, y2) {
    return points.map(([x, y]) => {
        return [x, y2 - (y - y2)];
    });
}

function translate(points, dx, dy) {
    return points.map(([x, y]) => {
        return [x + dx, y + dy];
    });
}

function App() {
    const aspect = 30;
    const description = [
        {
            color: 0,
            refcorner: 0,
            corner2: 0,
            tile2Ix: 0,
            tile2refcorner: 0,
            tile2corner2: 0,
            mirrored: 0,
        },
        {
            color: 1,
            refcorner: 1,
            corner2: 0,
            tile2Ix: 0,
            tile2refcorner: 1,
            tile2corner2: 2,
            mirrored: 0,
        },
        {
            color: 0,
            refcorner: 0,
            corner2: 1,
            tile2Ix: 1,
            tile2refcorner: 2,
            tile2corner2: 1,
            mirrored: 0,
        },
        {
            color: 1,
            refcorner: 1,
            corner2: 0,
            tile2Ix: 2,
            tile2refcorner: 1,
            tile2corner2: 2,
            mirrored: 0,
        },
        {
            color: 0,
            refcorner: 2,
            corner2: 0,
            tile2Ix: 1,
            tile2refcorner: 2,
            tile2corner2: 0,
            mirrored: 1,
        },
        {
            color: 1,
            refcorner: 1,
            corner2: 0,
            tile2Ix: 4,
            tile2refcorner: 1,
            tile2corner2: 2,
            mirrored: 1,
        },
        {
            color: 0,
            refcorner: 0,
            corner2: 1,
            tile2Ix: 5,
            tile2refcorner: 2,
            tile2corner2: 1,
            mirrored: 1,
        },
        {
            color: 1,
            refcorner: 1,
            corner2: 0,
            tile2Ix: 6,
            tile2refcorner: 1,
            tile2corner2: 2,
            mirrored: 1,
        },
    ];

    const ln1 = 2 * (aspect / 100);
    const ln2 = 2 - ln1;
    const baseTile = [
        [0, 0],
        [ln1, 0],
        [ln1, ln2],
    ]


    const fundRegionTiles = [];
    for (let i = 0; i < description.length; i++) {
        const tile = [];
        for (let j = 0; j < baseTile.length; j++) {
            tile.push([...baseTile[j]]);
        }
        fundRegionTiles.push(tile);
    }


    for (let i = 0; i < description.length; i++) {
        const desc = description[i];
        let tile = fundRegionTiles[i];
        tile.color = desc.color;
        if (desc.tile2Ix !== i) {
            const tile2 = fundRegionTiles[desc.tile2Ix];
            const dx = tile2[desc.tile2refcorner][0] - tile[desc.refcorner][0];
            const dy = tile2[desc.tile2refcorner][1] - tile[desc.refcorner][1];
            tile = translate(tile, dx, dy);
            if (desc.mirrored !== 0) {
                let angleRad = getAngle2(tile[desc.refcorner][0], tile[desc.refcorner][1], tile[desc.corner2][0], tile[desc.corner2][1]);
                tile = rotate(tile, tile[desc.refcorner][0], tile[desc.refcorner][1], -angleRad);
                tile = mirror(tile, tile[desc.refcorner][1]);
                angleRad = getAngle2(tile[desc.refcorner][0], tile[desc.refcorner][1], tile2[desc.tile2corner2][0], tile2[desc.tile2corner2][1]);
                tile = rotate(tile, tile[desc.refcorner][0], tile[desc.refcorner][1], angleRad);
            } else {
                const angleRad = getAngle1(tile[desc.refcorner][0], tile[desc.refcorner][1], tile[desc.corner2][0], tile[desc.corner2][1], tile2[desc.tile2corner2][0], tile2[desc.tile2corner2][1]);
                tile = rotate(tile, tile[desc.refcorner][0], tile[desc.refcorner][1], angleRad);
            }
        }
        fundRegionTiles[i] = tile;
    }

    for (let i = 0; i < fundRegionTiles.length; i++) {
        fundRegionTiles[i] = scale(fundRegionTiles[i], 0, 0, 20);
        fundRegionTiles[i] = translate(fundRegionTiles[i], 50, 50);
    }


    // Convert to shapes that work with Display
    const shapes = [];
    for (let i = 0; i < fundRegionTiles.length; i++) {
        const tile = fundRegionTiles[i];
        const shape = {
            points: () => tile.map(([x, y]) => `${x},${y}`).join(" "),
        };
        shapes.push(shape);
    }

    return <Display shapes={shapes}/>;
}

export default App
