Vue.component('primitive-interface-close', {
  data: () => ({
  }),

  methods: {
    initialize() {

    },

    onClose() {
      AppVue.dialog_primitives = false
    },

  },
  template: `

  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn text v-on:click="onClose" v-on="on">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </template>
  <span> Close window </span>
</v-tooltip>

`
})


