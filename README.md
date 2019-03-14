# [Vue テストハンドブック](https://lmiller1990.github.io/vue-testing-handbook/ja/)を学習する

## コンポーネントを render（マウント）する `mount`メソッドと`shallowMount`メソッド

`vue-test-utils`をコンポーネントを render（マウント）する `mount`メソッドと`shallowMount`メソッドを提供している。

- `mount`メソッド: 子コンポーネントも描画される。
- `shallowMount`メソッド: 子コンポーネントはスタブに置き換わる、そのため子コンポーネントの描画処理が実行されず、テストが早くなったり、子コンポーネントの外部依存によるエラーが発生しなくなる。

どちらのメソッドも`wrapper`という Vue component を含むオブジェクトを返す。それ以外にもテストに役立つ様々なメソッドを持っている。

## `propsData`

`propsData`を定義すれば、親コンポーネントから`props`として渡されたものとしてテストで利用できる。

```js
const wrapper = shallowMount(Foo, {
  propsData: {
    foo: 'bar'
  }
})
```

例えば以下のような`props`を受け取るコンポーネント場合

```html
<template>
  <div>
    <span v-if="isAdmin">管理者権限を実行する</span>
    <span v-else>権限がありません</span>
    <button>
      {{ msg }}
    </button>
  </div>
</template>

<script>
export default {
  name: "SubmitButton",

  props: {
    msg: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
};
</script>
```

以下のように`propsData`を定義することにより、テストができる。

```js
import { shallowMount } from '@vue/test-utils'
import SubmitButton from '@/components/SubmitButton.vue'

describe('SubmitButton.vue', () => {
  it('権限がない状態のメッセージを表示する', () => {
    const msg = "送信する"
    const wrapper = shallowMount(SubmitButton,{
      propsData: {
        msg: msg
      }
    })

    expect(wrapper.find("span").text()).toBe("権限がありません")
    expect(wrapper.find("button").text()).toBe("送信する")
  })
})
```
