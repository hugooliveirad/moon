Moon(["#target", document.querySelector("#target2")])
.animate
    "opacity": "1"
    "height": "500px"
    "width": "100px"
    "duration": 1000
    "delay": 100
    "beforeAnimation": ->
        console.log "beforeAnimation function running"
    "afterAnimation": ->
        console.log "afterAnimation function running"
.animate
    "opacity": ".5"
    "height": "300px"
    "width": "200px"
    "transform": "scale(1.3)"
    "background-color": "yellow"
    "duration": 1000
    "delay": 2000
    "beforeAnimation": ->
        console.log "beforeAnimation function running"
    "afterAnimation": ->
        console.log "afterAnimation function running"
.play ->
    console.log 'callback'
