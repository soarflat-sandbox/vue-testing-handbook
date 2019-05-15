# Vuexに依存するコンポーネントのテスト

Vuexに依存するコンポーネントのテストするためには、`createLocalVue`か`$store.state`を利用する。

## `state`のテスト

今回、以下の`<ComponentWithVuex>`コンポーネントをテストする。

```html
<template>
  <div>
    <div class="username">
      {{ username }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentWithVuex",

  data() {
    return {
      username: this.$store.state.username
    }
  }
}
</script>
```

`this.$store.state.username`があるのでVuexに依存している。

### `createLocalVue`を利用したテスト

`createLocalVue`はテストケース毎に利用できるVueインスタンスを返す。

グローバルVueクラスを汚染しないため、他のテストケースに影響を与えずにテストができる。

以下は`createLocalVue`一時的なVueインスタンスを作成し、Vuexをインストールしてテストを実行するテストの例。

```js
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
  // storeとlocalVueを渡すことで、テストするコンポーネントでVuex Storeのデータを利用できる。
  it("Vuex Storeを利用してusernameをレンダリングする", () => {
    const wrapper = shallowMount(ComponentWithVuex, {
      store,
      localVue
    });

    expect(wrapper.find(".username").text()).toBe("alice");
  });
});
```

これで`<ComponentWithVuex>`コンポーネントは正常に動作し、テストは通る。

### `$store.state`を利用したテスト

`mocks`オプションの`$store`プロパティにVuex Storeとして利用できるモックデータを定義できる。

こちらを利用すれば、上記のように`createLocalVue`を利用したりVuexをインストールする必要もない。

以下は`$store.state`を利用したテスト。

```js
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
```

こちらもコンポーネントが正常に動作するため、テストは通る。

## `getters`のテスト

`state`だけではなく、`getters`も同様にテストできる。

今回、以下の`<ComponentWithGetters>`コンポーネントをテストする。

```html
<template>
  <div class="fullname">
    {{ fullname }}
  </div>
</template>

<script>
export default {
  name: "ComponentWithGetters",

  computed: {
    fullname() {
      return this.$store.getters.fullname
    }
  }
}
</script>
```

### `createLocalVue`を利用したテスト

`state`のテストと同様で、`createLocalVue`一時的なVueインスタンスを作成し、Vuexをインストールしてテストを実行する。

```js
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
});
```

これで`<ComponentWithVuex>`コンポーネントは正常に動作し、テストは通る。

### `$store.state`を利用したテスト

こちらも`state`のテストと同じように`$store.state`を利用すればテストは通る。

```js
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
```
