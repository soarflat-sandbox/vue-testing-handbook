import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ComponentWithVuex from "@/components/ComponentWithVuex.vue";

// テストケース毎に利用できるVueインスタンスを生成
const localVue = createLocalVue();
localVue.use(Vuex);

// テストで利用するVuex Storeを定義
const store = new Vuex.Store({
  state: {
    username: "alice"
  }
});

describe("ComponentWithVuex.vue", () => {
  it("Vuex storeを利用してusernameをレンダリングする", () => {
    // storeとlocalVueを渡すことで、テストするコンポーネントでVuex Storeのデータを利用できる。
    const wrapper = shallowMount(ComponentWithVuex, {
      store,
      localVue
    });

    expect(wrapper.find(".username").text()).toBe("alice");
  });

  it("mock storeを利用してusernameをレンダリングする", () => {
    const wrapper = shallowMount(ComponentWithVuex, {
      mocks: {
        $store: {
          state: { username: "alice" }
        }
      }
    });
    expect(wrapper.find(".username").text()).toBe("alice");
  });
});
