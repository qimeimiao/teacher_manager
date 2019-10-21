<template>
    <div>
        <el-dialog :visible.sync="show" :title="'选择坐标'" @click="$emit('close')" :show-close="false">
            <div style="text-align:right">
                <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" style="display:inline-block"></el-amap-search-box>
            </div>
            <div class="selected-area">
                当前选择:
                经度:<span>{{lnglat.lng}}</span>
                维度:<span>{{lnglat.lat}}</span>
            </div>
            <div class="amap-wrapper">
                <el-amap class="amap-box" :events="events" :plugin="plugin" :center="mapCenter">
                    <el-amap-marker v-for="marker in markers" :position="marker" :key="marker.latitude" :events="markerEvents"></el-amap-marker>
                </el-amap>
            </div>
            <div slot="footer">
                <el-button @click="$emit('close')">取消</el-button><el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>    
</template>
<script>
import { AMapManager } from "vue-amap";
export default {
  name: "GPSPicker",
  props: {
    value: {
      type: Object
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let vm = this;
    return {
      lnglat: {},
      markers: [],
      markerEvents: {
        click(maker) {
          vm.lnglat = maker.lnglat;
        }
      },
      mapCenter: [121.59996, 31.197646],
      searchOption: {
        citylimit: false
      },
      plugin: ["ToolBar"],
      events: {
        init: o => {},
        moveend: () => {},
        zoomchange: () => {},
        click: e => {
          vm.lnglat = e.lnglat;
        }
      }
    };
  },
  created() {
    this.lnglat = this.value;
    if (this.value.lat) {
      let marker = [this.value.lng, this.value.lat];
      this.mapCenter = marker;
      this.markers.push(marker);
    }
  },
  watch: {
    value(val) {
      this.lnglat = val;
      if (this.value.lat) {
        let marker = [this.value.lng, this.value.lat];
        this.mapCenter = marker;
        this.markers.push(marker);
      }
    }
  },
  methods: {
    confirm() {
      this.$emit("input", this.lnglat);
      this.$emit("close");
    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.markers.push([poi.lng, poi.lat]);
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.mapCenter = [center.lng, center.lat];
      }
    }
  }
};
</script>
<style scoped>
.amap-wrapper {
  width: 100%;
  height: 500px;
}
.selected-area {
  font-size: 18px;
  padding: 10px 0;
}
</style>


