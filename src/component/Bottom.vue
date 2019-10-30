<template>
  <div style="margin-top:60px;">
    <v-bottom-navigation fixed horizontal id="bottom">
      <p id="name1">Pauline Volpi</p>
      <v-spacer></v-spacer>
      <p id="name2">Imane Benchara</p>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
#bottom{
  background-color: white;
}
#bottom #name1,#bottom #name2{
  font-size: 32px;
  user-select: none;
  color: #199461;
}
#bottom #name1{
  margin-left: 25px;
}
#bottom #name2{
  margin-right: 25px;
}
</style>
