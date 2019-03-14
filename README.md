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
});
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
    name: 'SubmitButton',

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
import { shallowMount } from '@vue/test-utils';
import SubmitButton from '@/components/SubmitButton.vue';

describe('SubmitButton.vue', () => {
  it('権限がない状態のメッセージを表示する', () => {
    const msg = '送信する';
    const wrapper = shallowMount(SubmitButton, {
      propsData: {
        msg: msg
      }
    });

    expect(wrapper.find('span').text()).toBe('権限がありません');
    expect(wrapper.find('button').text()).toBe('送信する');
  });
});
```

## 算出プロティ（`computed`）のテスト

以下のような算出プロパティを持ったコンポーネントは

```html
<template>
  <div>{{ numbers }}</div>
</template>

<script>
  export default {
    name: 'NumberRenderer',

    props: {
      even: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      numbers() {
        const evens = [];
        const odds = [];

        for (let i = 1; i < 10; i++) {
          if (i % 2 === 0) {
            evens.push(i);
          } else {
            odds.push(i);
          }
        }

        return this.even === true ? evens.join(', ') : odds.join(', ');
      }
    }
  };
</script>
```

以下のようにテストできる。

```js
import { shallowMount } from '@vue/test-utils';
import NumberRenderer from '@/components/NumberRenderer.vue';

describe('NumberRenderer.vue', () => {
  it('偶数を render', () => {
    const wrapper = shallowMount(NumberRenderer, {
      propsData: {
        even: true
      }
    });

    expect(wrapper.text()).toBe('2, 4, 6, 8');
  });

  it('奇数を render', () => {
    const localThis = { even: false };

    expect(NumberRenderer.computed.numbers.call(localThis)).toBe(
      '1, 3, 5, 7, 9'
    );
  });
});
```

上記のテストはそれぞれ以下のようにテストの仕方が異なる。.

- `"偶数を render"`: `shallowMount`で描画したテキストをアサートしている。
- `"奇数を render"`: `NumberRenderer.computed.numbers`を`call`で`this`を置き換えて実行し、その結果をアサートしている。

### `call`と`shallowMount`のどちらを利用すべきか？

> 算出プロパティのテストを書くには`call`と`shallowMount`が両方とも便利なテクニックです。`call`が特に便利な場合は：
>
> - `mounted`などの インスタンスライフサイクルフック の実行に時間がかかる場合、またライフサイクルフックを呼び出したくない場合です。コンポーネントをレンダーしないので、ライフサイクルフックも実行しません。
> - `this`を細かく設定したい場合
>
> もちろんコンポーネントが正しくレンダーするテストも必要です。テストしたいことに合わせてもっとも適切なテクニックを選んで、エッジケースをちゃんとテストします。
