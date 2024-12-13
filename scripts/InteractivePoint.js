class InteractivePointOverlay {
    //bounds from SE to NW
    /**
     * @param {Object} map
     * @param {Array} coordinate 
     * @param {Array} bounds 
     * @param {String} frontImage
     * @param {Array} images
     * @param {L.LayerGroup} layerGroup
    */
    constructor(map, coordinate, bounds, frontImage, images, layerGroup){
        this.map = map
        this.frontImages = frontImage 
        this.images = images
        this.coordinate = map.unproject(coordinate, map.getMaxZoom());
        this.click_bounds = bounds
        this.bounds = [
            map.unproject(bounds[0], map.getMaxZoom()), // SW
            map.unproject(bounds[1], map.getMaxZoom())  // NE
        ];
        this.max_x = Math.max(this.click_bounds[0][0], this.click_bounds[1][0]);
        this.min_x = Math.min(this.click_bounds[0][0], this.click_bounds[1][0]);
        this.max_y = Math.max(this.click_bounds[0][1], this.click_bounds[1][1]);
        this.min_y = Math.min(this.click_bounds[0][1], this.click_bounds[1][1]);


        this.layerGroup = layerGroup
        this.imageOverlay = L.imageOverlay(frontImage, this.bounds).addTo(this.layerGroup);
        this.isVisible = false

        this.init()
    }

    init(){
        let circleMarker = L.circleMarker(this.coordinate, {
            radius: 6,
            fillColor: 'transparent', // Correct spelling
            color: 'transparent',
            opacity: 1,
            fillOpacity: 1
        }).addTo(this.layerGroup);
        this.marker = L.polygon(this.createBounds(), {
            color: 'transparent',
            fillcolor: 'transparent',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(this.layerGroup)

        circleMarker.on('click', (e)=>{
            e.originalEvent.stopPropagation();
            this.handleMarkerClick(e);
        });

        this.marker.on('click', (e)=>{
            e.originalEvent.stopPropagation();
            this.handleClick(e)
        });
    }

    handleMarkerClick(e){
        this.isVisible = !this.isVisible;

        this.updateVisibility();
    }

    handleClick(e){
        var clickPoint = map.project(e.latlng, map.getMaxZoom());
        if((this.min_x <= clickPoint.x <= this.max_x) && (this.min_y <= clickPoint.y <= this.max_y)){
            this.openGallery(this.images)
            document.getElementById('foreground-gal').style.display = 'flex';
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

    updateVisibility(){
        if(this.isVisible){
            this.imageOverlay = L.imageOverlay(this.images[this.index], this.bounds).addTo(this.layerGroup);    
        } else {
            if(this.imageOverlay!=null){
                this.imageOverlay.remove()
            }
        }
    }

    openGallery(images){
        let pictureContainer = document.getElementsByClassName('picture-container')[0]
        console.log(pictureContainer)
        pictureContainer.innerHTML = '';
        images.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
            pictureContainer.appendChild(img);
        });
    }
}


