<template>
  <div class="home" id="index" ref="appRef">
    <div class="content">
      <myHeader/>
      <h1 @click="click">home test</h1>
      <div id="chart"></div>
      home test
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import useIndex from "@/util/useDraw";
import { office } from "@/api";
import myHeader from "./components/header.vue";
import * as echarts from "echarts";

export default {
  name: "MessageSection",
  components: {
    myHeader
  },
  setup() {
    // const list = ref(null)
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    // * 适配处理
    const { appRef, calcRate, windowDraw } = useIndex();
    // 生命周期
    onMounted(() => {
      // todo 屏幕适应
      windowDraw();
      calcRate();

      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line"
          }
        ]
      };

      option && myChart.setOption(option);
    });

    function sendMessage() {
      console.log(store, 11);
      const trimedText = text.value.trim();
      if (trimedText) {
        store.dispatch("sendMessage", {
          text: trimedText,
          thread: thread.value
        });
        this.text = "";
      }
    }

    const click = async () => {
      console.log(store);
      let res = await office({});
      console.log(res);
    };
    return {
      sendMessage,
      click,
      appRef
    };
  }
};
</script>


<style lang="scss" scoped>
@import "@/assets/scss/index.scss";
.home {

}

.content {
  h1 {
    color: skyblue;
  }
  #chart {
    width: 350px;
    height: 350px;
  }
}
</style>
