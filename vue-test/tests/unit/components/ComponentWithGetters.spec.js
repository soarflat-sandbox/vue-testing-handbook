import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ComponentWithGetters from "@/components/ComponentWithGetters.vue";

// テストケース毎に利用できるVueインスタンスを生成
const localVue = createLocalVue();
localVue.use(Vuex);

// テストで利用するVuex Storeを定義
const store = new Vuex.Store({
  state: {
    firstName: "Alice",
    lastName: "Doe"
  },

  getters: {
    fullname: state => state.firstName + " " + state.lastName
  }
});

describe("ComponentWithVuex.vue", () => {
  it("Vuex getterを利用してusernameをレンダリングする", () => {
    // storeとlocalVueを渡すことで、テストするコンポーネントでVuex Storeのデータを利用できる。
    const wrapper = shallowMount(ComponentWithGetters, { store, localVue });
    expect(wrapper.find(".fullname").text()).toBe("Alice Doe");
  });

  it("mock storeを利用してusernameをレンダリングする", () => {
    const wrapper = shallowMount(ComponentWithGetters, {
      mocks: {
        $store: {
          getters: { fullname: "Alice Doe" }
        }
      }
    });
    expect(wrapper.find(".fullname").text()).toBe("Alice Doe");
  });
});
