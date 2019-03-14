import { mount } from "@vue/test-utils";
import Greeting from "@/components/Greeting.vue";

// Greeting.vue は greeting の値を render するだけのコンポーネント
// そのため、以下の流れでテストをしていく
// 1. コンポーネントを mount を利用して render する
// 2. コンポーネントのテキスト部分に "Vue and TDD" が含まれていることを assert する
describe("Greeting.vue", () => {
  it("renders a greeting", () => {
    // mount で render したコンポーネントを wrapper に紐づける（wrapper を用いるのが慣習らしい）
    const wrapper = mount(Greeting);

    expect(wrapper.text()).toMatch("Vue and TDD");
    // ↑は以下と同じ
    // expect(wrapper.html().includes("Vue and TDD")).toBe(true)
  });
});
