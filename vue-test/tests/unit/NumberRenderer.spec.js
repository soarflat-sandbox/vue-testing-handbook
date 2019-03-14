import { shallowMount } from "@vue/test-utils";
import NumberRenderer from "@/components/NumberRenderer.vue";

describe("NumberRenderer.vue", () => {
  it("偶数を render", () => {
    const wrapper = shallowMount(NumberRenderer, {
      propsData: {
        even: true
      }
    });

    expect(wrapper.text()).toBe("2, 4, 6, 8");
  });

  it("奇数を render", () => {
    const localThis = { even: false };

    expect(NumberRenderer.computed.numbers.call(localThis)).toBe(
      "1, 3, 5, 7, 9"
    );
  });
});
