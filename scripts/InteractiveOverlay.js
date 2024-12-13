class InteractiveOverlay {
    //bounds from SE to NW
    /**
     * @param {Object} map
     * @param {Array} bounds  
     * @param {Array} images
     * @param {Boolean} toggleAble
     * @param {L.LayerGroup} layerGroup
    */
    constructor(map, bounds, images, toggleAble, layerGroup){
        this.map = map
        this.images = images
        this.click_bounds = bounds
        this.bounds = [
            map.unproject(bounds[0], map.getMaxZoom()), // SW
            map.unproject(bounds[1], map.getMaxZoom())  // NE
        ];
        this.layerGroup = layerGroup
        this.imageOverlay = L.imageOverlay(images[0], this.bounds).addTo(this.layerGroup);
        this.toggleAble = toggleAble
        this.index = 0

        this.max_x = Math.max(this.click_bounds[0][0], this.click_bounds[1][0]);
        this.min_x = Math.min(this.click_bounds[0][0], this.click_bounds[1][0]);
        this.max_y = Math.max(this.click_bounds[0][1], this.click_bounds[1][1]);
        this.min_y = Math.min(this.click_bounds[0][1], this.click_bounds[1][1]);

        this.init()
    }

    init(){
        this.marker = L.polygon(this.createBounds(), {
            color: 'transparent',
            fillcolor: 'transparent',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(this.layerGroup)

        this.marker.on('click', (e)=>{
            e.originalEvent.stopPropagation();
            this.handleClick(e)
        });
    }

    handleClick(e){
        if(!this.toggleAble){
            var clickPoint = map.project(e.latlng, map.getMaxZoom());
            

            if((this.min_x <= clickPoint.x <= this.max_x) && (this.min_y <= clickPoint.y <= this.max_y)){
                let image = this.images[this.index]
                let imgName = image.substring(image.lastIndexOf("/")+1, image.lastIndexOf("."))
                document.getElementById('glbViewer').src = `./data/models/${imgName}.glb`;
                document.getElementById('foreground-glb').style.display = 'flex';
            }
        }else{
            this.index++;
            if(this.index > this.images.length-1){
                this.index = 0;
            }

            this.imageOverlay.remove()
            this.imageOverlay = L.imageOverlay(this.images[this.index], this.bounds)
            .addTo(this.layerGroup);            
        }
    }

    createBounds(){
        let bound = [
            [this.max_x, this.max_y],
            [this.max_x, this.min_y],
            [this.min_x, this.min_y],
            [this.min_x, this.max_y]
        ]

        return bound.map(point => map.unproject(point, map.getMaxZoom()))
    }
}
