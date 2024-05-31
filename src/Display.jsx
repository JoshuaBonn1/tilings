import './Display.css'

function Display(params) {
    const shapes = params.shapes;
    return <div id={"display"}>
        <svg id={"display-svg"}>
            {
                shapes.map((shape, index) => {
                    return <polygon key={index} fill={"transparent"} stroke={"black"} points={shape.points()}/>
                })
            }
        </svg>
    </div>;
}

export default Display;