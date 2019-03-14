import flushPromises from "flush-promises";
import { shallowMount } from "@vue/test-utils";
import FormSubmitter from "@/components/FormSubmitter.vue";

let url = "";
let data = "";

const mockHttp = {
  get: (_url, _data) => {
    return new Promise(resolve => {
      url = _url;
      data = _data;
      resolve();
    });
  }
};

describe("FormSubmitter.vue", () => {
  it("フォームを更新するとお知らせを表示", () => {
    // 1. arrange (初期設定) - テストの準備。この場合、コンポーネントをレンダーします
    const wrapper = shallowMount(FormSubmitter);

    // 2. act (実行) - システムを実行します。
    wrapper.find("[data-username]").setValue("alice");
    wrapper.find("form").trigger("submit.prevent");

    // 3. assert (検証）- 期待と検証を比べます。
    expect(wrapper.find(".message").text()).toBe(
      "aliceさん、お問い合わせ、ありがとうございます。"
    );
  });

  it("フォームを更新するとお知らせを表示（非同期）", async () => {
    const wrapper = shallowMount(FormSubmitter, {
      data() {
        return {
          asyncTest: true
        };
      },
      mocks: {
        $http: mockHttp
      }
    });

    wrapper.find("[data-username]").setValue("alice");
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();

    expect(wrapper.find(".message").text()).toBe(
      "aliceさん、お問い合わせ、ありがとうございます。"
    );
    expect(url).toBe("/api/v1/register");
    expect(data).toEqual({ username: "alice" });
  });
});
