import { shallowMount } from "@vue/test-utils";
import SubmitButton from "@/components/SubmitButton.vue";

describe("SubmitButton.vue", () => {
  it("権限がない状態のメッセージを表示する", () => {
    const msg = "送信する";
    const wrapper = shallowMount(SubmitButton, {
      propsData: {
        msg
      }
    });

    console.log(wrapper.html());
    // =>
    // <div>
    //   <span>権限がありません</span>
    //   <button>
    //     送信する
    //   </button>
    // </div>

    expect(wrapper.find("span").text()).toBe("権限がありません");
    expect(wrapper.find("button").text()).toBe("送信する");
  });

  it("権限がある状態のメッセージを表示する", () => {
    const msg = "送信する";
    const isAdmin = true;
    const wrapper = shallowMount(SubmitButton, {
      propsData: {
        msg,
        isAdmin
      }
    });

    console.log(wrapper.html());
    // =>
    // <div>
    //   <span>管理者権限を実行する</span>
    //   <button>
    //     送信する
    //   </button>
    // </div>

    expect(wrapper.find("span").text()).toBe("管理者権限を実行する");
    expect(wrapper.find("button").text()).toBe("送信する");
  });
});
