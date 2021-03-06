'use strict';
import 'js-marker-clusterer';
import $ from 'jquery';

const createMarkerInfoWindowContent = Symbol();
const createMarker = Symbol();
const initInfoWindowContentEvents = Symbol();

const infoWindowCSSClass = 'map__info-window';
const infoWindowLinkCSSClass = infoWindowCSSClass + '-link';

MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://chmurson.github.io/shopify/images/cluster-marker/m';

export class Map {

  /**
   * @param {Number} lat
   * @param {Number} lng
   * @param {String} containerId
   * @param {InpostApi} apiInpost
   */
  constructor({lat, lng, containerId, apiInpost}) {
    this.apiInpost = apiInpost;
    this.conatiner = document.getElementById(containerId);
    this.currentlySelectedPaczkomat = null;
    this.paczkomatSelectedCallback = ()=> {
    };
    this.infoWindow = new google.maps.InfoWindow();
    this.googleMap = new google.maps.Map(this.conatiner, {
      center: {lat: lat, lng: lng},
      zoom: 5,
      disableDefaultUI: true
    });

    setInterval(()=> {
      console.log({
        center: this.googleMap.getCenter().toJSON(),
        zoom: this.googleMap.getZoom()
      })
    }, 2000);


    this[initInfoWindowContentEvents]();
  }

  /**
   * @returns {Promise.<undefined>}
   */
  loadMarkers() {
    if (this.markers) {
      return $.when(this.markers);
    }
    return this.apiInpost
      .getPaczkomaty()
      .then((paczkomaty)=> paczkomaty.map(p=> this[createMarker](p)))
      .then((markers)=> this.markers = markers)
  }

  /**
   * @param lng
   * @param lat
   */
  center(lng, lat) {
    this.googleMap.setCenter({lng: Number.parseFloat(lng), lat: Number.parseFloat(lat)});
    this.googleMap.setZoom(11);
  }

  /**
   * @returns {Promise.<MarkerClusterer>}
   */
  createMarkers() {
    return this.loadMarkers().then((markers)=>new MarkerClusterer(this.googleMap, markers))
  }

  /**
   */
  checkResize() {
    google.maps.event.trigger(this.googleMap, 'resize');
  }


  onPaczkomatSelected(callback) {
    this.paczkomatSelectedCallback = callback;
  }


  /**
   * Returns a marker, but not saves it
   * @private
   * @param {Paczkomat} paczkomat
   * @returns {google.maps.Marker}
   */
  [createMarker](paczkomat) {
    const latLng = new google.maps.LatLng(paczkomat.latitude, paczkomat.longitude);
    const marker = new google.maps.Marker({'position': latLng});
    marker.addListener('click', ()=> {
      this.currentlySelectedPaczkomat = paczkomat;
      this.infoWindow.setContent(this[createMarkerInfoWindowContent]({
        address: paczkomat.address, description: paczkomat.description
      }));
      this.infoWindow.open(this.googleMap, marker);

    });
    return marker;
  }

  /**
   * @private
   */
  [createMarkerInfoWindowContent]({address, description}) {
    return `
      <div class="${infoWindowCSSClass}">
        <div class="${infoWindowCSSClass}-label">
          ${address}
        </div>        
        <div class="${infoWindowCSSClass}-description">
          ${description}
        </div>
        <div>
          <a class="${infoWindowLinkCSSClass}" href>Wybierz</a>
        </div>
      </div>
    `;
  }

  [initInfoWindowContentEvents]() {
    this.conatiner.addEventListener('click', (e)=> {
      if (e.target.className === infoWindowLinkCSSClass) {
        e.preventDefault();
        this.infoWindow.close();
        this.paczkomatSelectedCallback(this.currentlySelectedPaczkomat);
      }
    });
  }

}

/**
 * @type {InpostApi}
 */
Map.prototype.apiInpost = null;