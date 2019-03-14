<template>
  <div>
    {{ greeting }}
  </div>
</template>

<script>
// greeting の値を render するだけのコンポーネント
export default {
  name: "Greeting",

  data() {
    return {
      greeting: "Vue and TDD"
    };
  }
};
</script>
