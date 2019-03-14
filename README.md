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

## イベントをシミュレーションしてテストをする

ユーザー操作などにより発生するイベントをシミュレーションし、イベント発生後の状態のテストをする。

以下はフォームをサブミットすると、メッセージが表示されるコンポーネント。

```html
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username />
      <input type="submit" />
    </form>

    <div class="message" v-show="submitted">
      {{ username }}さん、お問い合わせ、ありがとうございます。
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FormSubmitter',

    data() {
      return {
        username: '',
        submitted: false
      };
    },

    methods: {
      handleSubmit() {
        this.submitted = true;
      }
    }
  };
</script>
```

以下のようにすれば、サブミットイベントがシミュレートでき、テストができる。

```js
import { shallowMount } from '@vue/test-utils';
import FormSubmitter from '@/components/FormSubmitter.vue';

describe('FormSubmitter.vue', () => {
  it('フォームを更新するとお知らせを表示', () => {
    // 1. arrange (初期設定) - テストの準備。この場合、コンポーネントをレンダーします
    const wrapper = shallowMount(FormSubmitter);

    // 2. act (実行) - システムを実行します。
    wrapper.find('[data-username]').setValue('alice');
    wrapper.find('form').trigger('submit.prevent');

    // 3. assert (検証）- 期待と検証を比べます。
    expect(wrapper.find('.message').text()).toBe(
      'aliceさん、お問い合わせ、ありがとうございます。'
    );
  });
});
```

### HTTP リクエスト(AJAX コール)をモックに置き換える

Vue.js では`axios`を`Vue.prototype.$http`のエイリアスにすることがよくあり、以下のように利用されていることが多い。

```js
handleSubmitAsync() {
  return this.$http.get("/api/v1/register", { username: this.username })
    .then(() => {
      // メッセージを表示するなど
    })
    .catch(() => {
      // エラーをハンドル
    })
}
```

もし、`this.$http`をモックにしたら、実際に通信をおこわなくても上記のコードを簡単にテストできる。

`http.get`のモックは以下のように実装できる。

```js
let url = '';
let data = '';

const mockHttp = {
  get: (_url, _data) => {
    return new Promise((resolve, reject) => {
      url = _url;
      data = _data;
      resolve();
    });
  }
};
```

上記のモックを利用するためには、以下のように`mocks`オプションを指定する必要がある。

非同期処理なので、`describe`のコールバック関数に`async`をつけて`await flushPromises()`を実行しないと、非同期処理の完了前にアサートが実行され、テストが失敗する。

```js
import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import FormSubmitter from '@/components/FormSubmitter.vue';

let url = '';
let data = '';

const mockHttp = {
  get: (_url, _data) => {
    return new Promise(resolve => {
      url = _url;
      data = _data;
      resolve();
    });
  }
};

describe('FormSubmitter.vue', () => {
  it('フォームを更新するとお知らせを表示', () => {
    // 1. arrange (初期設定) - テストの準備。この場合、コンポーネントをレンダーします
    const wrapper = shallowMount(FormSubmitter);

    // 2. act (実行) - システムを実行します。
    wrapper.find('[data-username]').setValue('alice');
    wrapper.find('form').trigger('submit.prevent');

    // 3. assert (検証）- 期待と検証を比べます。
    expect(wrapper.find('.message').text()).toBe(
      'aliceさん、お問い合わせ、ありがとうございます。'
    );
  });

  it('フォームを更新するとお知らせを表示（非同期）', async () => {
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

    wrapper.find('[data-username]').setValue('alice');
    wrapper.find('form').trigger('submit.prevent');

    await flushPromises();

    expect(wrapper.find('.message').text()).toBe(
      'aliceさん、お問い合わせ、ありがとうございます。'
    );
    expect(url).toBe('/api/v1/register');
    expect(data).toEqual({ username: 'alice' });
  });
});
```

上記のテストが動くコンポーネントは以下の通り。

```html
<template>
  <div>
    <form @submit.prevent="handleSubmitAsync" v-if="asyncTest">
      <input v-model="username" data-username />
      <input type="submit" />
    </form>
    <form @submit.prevent="handleSubmit" v-else>
      <input v-model="username" data-username />
      <input type="submit" />
    </form>

    <div class="message" v-if="submitted">
      {{ username }}さん、お問い合わせ、ありがとうございます。
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FormSubmitter',
    data() {
      return {
        username: '',
        submitted: false,
        asyncTest: false
      };
    },
    methods: {
      handleSubmit() {
        this.submitted = true;
      },
      handleSubmitAsync() {
        return this.$http
          .get('/api/v1/register', { username: this.username })
          .then(() => {
            this.submitted = true;
          })
          .catch(e => {
            throw Error('Something went wrong', e);
          });
      }
    }
  };
</script>
```

## 発生したイベントのテスト

## Vuex - ミューテーションのテスト

ミューテションはただの関数なので、容易にテストできる。

```js
export default {
  SET_POST(state, { post }) {
    state.postIds.push(post.id);
    state.posts = { ...state.posts, [post.id]: post };
  }
};
```

```js
import mutations from '@/store/mutations.js';

describe('SET_POST', () => {
  it('state に投稿を追加する ', () => {
    const post = { id: 1, title: 'post' };
    const state = {
      postIds: [],
      posts: {}
    };

    mutations.SET_POST(state, { post });

    expect(state).toEqual({
      postIds: [1],
      posts: { '1': post }
    });
  });
});
```

## Vuex - アクションのテスト

ミューテションと同様で、単独のアクションのテストも容易にできる。

まずは以下のアクションを作成してみる。

1. API を非同期呼び出しをする
2. データに対して何らかの処理を行う
3. ペイロードとして結果を使ってミューテーションをコミットする

`authenticate`アクションでユーザー名とパスワードを外部 API に送信し、それらが一致するかどうかを確認する。

結果は`SET_AUTHENTICATED`ペイロードとしてミューテーションをコミットする。

```js
import axios from 'axios';

export default {
  async authenticate({ commit }, { username, password }) {
    const authenticated = await axios.post('/api/authenticate', {
      username,
      password
    });

    commit('set_authenticated', authenticated);
  }
};
```

このアクションに対しては以下のテストをする。

1. 正しい API エンドポイントが使用されたかどうか
2. ペイロードは正しいか
3. 正しいミューテーションがコミットされた

```js
describe('authenticate', () => {
  it('authenticated a user', async () => {
    const commit = jest.fn();
    const username = 'alice';
    const password = 'password';

    await actions.authenticate({ commit }, { username, password });

    expect(url).toBe('/api/authenticate');
    expect(body).toEqual({ username, password });
    expect(commit).toHaveBeenCalledWith('SET_AUTHENTICATED', true);
  });
});
```

上記のテストは、そもそもリクエストするサーバすら存在しない状況のため失敗する。

Jest の`jest.mock`を利用して、API 呼び出しをモックに置き換える。

`axios`のモックは以下のように実装できる。API 呼び出しをシミュレートし、Promise を即時に resolve する。

```js
let url = '';
let body = {};

jest.mock('axios', () => ({
  post: (_url, _body) => {
    return new Promise(resolve => {
      url = _url;
      body = _body;
      resolve(true);
    });
  }
}));
```

そのため、以下のようにすればテストは成功する。

```js
import actions from '@/store/actions.js';

let url = '';
let body = {};

jest.mock('axios', () => ({
  post: (_url, _body) => {
    return new Promise(resolve => {
      url = _url;
      body = _body;
      resolve(true);
    });
  }
}));

describe('authenticate', () => {
  it('authenticated a user', async () => {
    const commit = jest.fn();
    const username = 'alice';
    const password = 'password';

    await actions.authenticate({ commit }, { username, password });

    expect(url).toBe('/api/authenticate');
    expect(body).toEqual({ username, password });
    expect(commit).toHaveBeenCalledWith('SET_AUTHENTICATED', true);
  });
});
```

### API エラーのテスト

上記は API 呼び出しが成功した場合のみのテストだが、エラーが発生した場合のテストも追加する。

```js
it('catches an error', async () => {
  mockError = true;

  await expect(actions.authenticate({ commit: jest.fn() }, {})).rejects.toThrow(
    'API Error occurred.'
  );
});
```

モックにエラーをスローさせるためには、以下のように変更をする。

```js
let url = '';
let body = {};
let mockError = false;

jest.mock('axios', () => ({
  post: (_url, _body) => {
    return new Promise(resolve => {
      if (mockError) throw Error();

      url = _url;
      body = _body;
      resolve(true);
    });
  }
}));
```

上記の変更に併せて、アクションが予期しているエラーをスローするように変更する。

```js
export default {
  async authenticate({ commit }, { username, password }) {
    try {
      const authenticated = await axios.post('/api/authenticate', {
        username,
        password
      });

      commit('SET_AUTHENTICATED', authenticated);
    } catch (e) {
      throw Error('API Error occurred.');
    }
  }
};
```
