# [Vue テストハンドブック](https://lmiller1990.github.io/vue-testing-handbook/ja/)を学習する

## コンポーネントを render（マウント）する `mount`メソッドと`shallowMount`メソッド

`vue-test-utils`をコンポーネントを render（マウント）する `mount`メソッドと`shallowMount`メソッドを提供している。

- `mount`メソッド: 子コンポーネントも描画される。
- `shallowMount`メソッド: 子コンポーネントはスタブに置き換わる、そのため子コンポーネントの描画処理が実行されず、テストが早くなったり、子コンポーネントの外部依存によるエラーが発生しなくなる。

どちらのメソッドも`wrapper`という Vue component を含むオブジェクトを返す。それ以外にもテストに役立つ様々なメソッドを持っている。
