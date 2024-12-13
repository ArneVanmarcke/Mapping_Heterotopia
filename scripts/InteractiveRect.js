class InteractiveRect {
    //bounds from SE to NW
    /**
     * @param {Object} map
     * @param {Array} rectBounds
     * @param {String} image
     * @param {Array} bounds   
     * @param {L.LayerGroup} layerGroup
     * @param {String} color
    */
    constructor(map, rectBounds,image, bounds, layerGroup, color){
        this.map = map
        this.image = image
        this.rectBounds = rectBounds.map(point => map.unproject(point, map.getMaxZoom()));
        this.click_bounds = bounds
        this.bounds = [
            map.unproject(bounds[0], map.getMaxZoom()), // SW
            map.unproject(bounds[1], map.getMaxZoom())  // NE
        ];
        this.layerGroup = layerGroup
        this.color = color
        this.isImage = (this.image.endsWith(".jpg") || this.image.endsWith(".png"))
        this.imageOverlay = null
        this.init()
    }

    init(){
        this.marker = L.polygon(this.rectBounds, {
            color: this.color,
            fillcolor: this.color,
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
        //console.log("clicked:", this)
        var clickPoint = map.project(e.latlng, map.getMaxZoom());
        let max_x = Math.max(this.click_bounds[0][0], this.click_bounds[1][0]);
        let min_x = Math.min(this.click_bounds[0][0], this.click_bounds[1][0]);
        let max_y = Math.max(this.click_bounds[0][1], this.click_bounds[1][1]);
        let min_y = Math.min(this.click_bounds[0][1], this.click_bounds[1][1]);

        if((min_x <= clickPoint.x <= max_x) && (min_y <= clickPoint.y <= max_y) && this.imageOverlay && !this.isImage){
            let imgName = this.image.substring(this.image.lastIndexOf("/")+1, this.image.lastIndexOf("."))
            document.getElementById("glb").style.display = 'flex';
            document.getElementById("gallery").style.display = 'none';
            document.getElementById('glbViewer').src = `./data/models/${imgName}.glb`;
            document.getElementById('foreground').style.display = 'flex';
        }


        if (InteractiveRect.activePoint && InteractiveRect.activePoint !== this) {
            InteractiveRect.activePoint.removeImageOverlay();
        }

        if (this.imageOverlay) {
            this.removeImageOverlay();
        } else {
            this.marker.setStyle({ opacity: 0, fillOpacity: 0 });
            this.showImageOverlay();
            InteractiveRect.activePoint = this;
        }
    }

    showImageOverlay(){
        if(this.isImage){
            this.imageOverlay = L.imageOverlay(this.image, this.bounds).addTo(this.layerGroup);
        }else{
            this.imageOverlay = L.videoOverlay(this.image, this.bounds).addTo(this.layerGroup);
        }
        this.map.once('click', this.removeImageOverlay.bind(this));
    }

    removeImageOverlay(){
        if(this.imageOverlay){
            this.layerGroup.removeLayer(this.imageOverlay)
            this.imageOverlay = null
        }
        if(InteractiveRect.activePoint === this){
            InteractivePoint.activePoint = null;
        }
        this.marker.setStyle({ opacity: 1, fillOpacity: 0.8 });
    }
}
