/** @format */

export function init() {
  const App = {
    data() {
      return {
        input: "你好",
        msglist: [],
        inputHistort: [],
        axiosInstance: axios.create({
          baseURL: "http://127.0.0.1:5555",
          // baseURL: "http://106.14.121.85:5067",
          //   timeout: 6000,
          headers: { "Content-Type": "application/json" },
        }),
      };
    },
    methods: {
      async sendMsg() {
        if (!this.input) return;
        const container = document.querySelector(".container");
        this.inputHistort.push(this.input);
        this.msglist.push({ to: "right", msg: this.input, role: "user" });
        const inputHistort = this.msglist.map(({ msg }) => {
          return msg;
        });
        // console.log(inputHistort);
        const res = await this.axiosInstance.post("/docs", { content: this.input, history: inputHistort });
        if (res.status !== 201) return;
        // console.log(res);
        this.input = "";
        this.msglist.push({ to: "left", msg: res.data.text, role: "assistant" });
        this.$nextTick(() => {
          container.scrollTop = container.scrollHeight;
        });
      },
    },
  };
  const app = Vue.createApp(App);
  app.use(ElementPlus);
  app.mount("#app");
}
