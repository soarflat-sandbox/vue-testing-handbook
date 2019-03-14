import { shallowMount } from "@vue/test-utils";
import Emitter from "@/components/Emitter.vue";

describe("Emitter.vue", () => {
  it("２つの引数があるイベントを発火する", () => {
    const wrapper = shallowMount(Emitter);

    wrapper.vm.emitEvent();

    console.log(wrapper.emitted());
    // => [Object: null prototype] { myEvent: [ [ 'name', 'password' ] ] }

    expect(wrapper.emitted().myEvent[0]).toEqual(["name", "password"]);
  });

  it("コンポーネントを render せずにイベントを検証する", () => {
    const events = {};
    const $emit = (event, ...args) => {
      events[event] = [...args];
    };

    Emitter.methods.emitEvent.call({ $emit });

    expect(events.myEvent).toEqual(["name", "password"]);
  });
});
