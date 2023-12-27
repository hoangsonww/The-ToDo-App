<template>
  <div id="app">
    <header>
      <h1>Welcome to The ToDo App</h1>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer>
      <p>&copy; 2023 The ToDo App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  text-align: center;
}
</style>