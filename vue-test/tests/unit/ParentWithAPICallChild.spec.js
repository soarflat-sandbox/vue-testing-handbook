import { shallowMount, mount } from "@vue/test-utils";
import ParentWithAPICallChild from "@/components/ParentWithAPICallChild.vue";
import ComponentWithAsyncCall from "@/components/ComponentWithAsyncCall.vue";

describe("ParentWithAPICallChild.vue", () => {
  it("mountでレンダリングし、API呼び出しを初期化する", () => {
    const wrapper = mount(ParentWithAPICallChild, {
      stubs: {
        // 指定したコンポーネントをスタブに置き換える
        ComponentWithAsyncCall: true
      }
    });

    expect(wrapper.find(ComponentWithAsyncCall).exists()).toBe(true);
  });

  // shallowMount を利用すれば子コンポーネントは自動でスタブに置き換わる
  it("shallowMountでレンダリングし、API呼び出しを初期化しない", () => {
    const wrapper = shallowMount(ParentWithAPICallChild);

    expect(wrapper.find(ComponentWithAsyncCall).exists()).toBe(true);
  });
});
