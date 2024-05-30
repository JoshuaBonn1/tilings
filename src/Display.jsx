import './Display.css'

function Display() {
    return <div id={"display"}>
        <svg id={"display-svg"}>
            <circle cx="100" cy="50" r="40" fill="red"/>
            <circle cx="200" cy="50" r="40" fill="green"/>
            <circle cx="300" cy="50" r="40" fill="blue"/>
        </svg>
    </div>;
}

export default Display;