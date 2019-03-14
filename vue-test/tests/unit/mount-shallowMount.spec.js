import Vue from "vue";
import { mount, shallowMount } from "@vue/test-utils";

describe("mount shallowMount のチェック（問答無用でテストは通る）", () => {
  it("renders Child", () => {
    const Child = Vue.component("Child", {
      name: "Child",

      template: "<div>Child component</div>"
    });

    const Parent = Vue.component("Parent", {
      name: "Parent",

      template: "<div><child /></div>"
    });

    const shallowWrapper = shallowMount(Child);
    const mountWrapper = mount(Child);

    console.log(shallowWrapper.html());
    // => <div>Child component</div>
    console.log(mountWrapper.html());
    // => <div>Child component</div>
  });

  it("renders Parent", () => {
    const Parent = Vue.component("Parent", {
      name: "Parent",

      template: "<div><child /></div>"
    });

    const shallowWrapper = shallowMount(Parent);
    const mountWrapper = mount(Parent);

    console.log(shallowWrapper.html());
    // shallowMount の場合、子コンポーネントはスタブに置き換わる
    // => <div><child-stub></child-stub></div>
    console.log(mountWrapper.html());
    // => <div><div>Child component</div></div>
  });
});
