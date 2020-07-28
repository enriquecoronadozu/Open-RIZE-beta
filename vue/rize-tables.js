
Vue.component('rize-table-reaction', {
  props: ['title'],
  data: () => ({

    rizeReactions: [],
    dialog_comment:false,
    dialog: false,
    
    rules: [v => v.length <= 20 || 'Max 20 characters'],
    rules_comment: [v => v.length <= 100 || 'Max 100 characters'],
    headers: [
      {
        text: 'Robot Behavior',
        align: 'left',
        sortable: true,
        value: 'name',
        width: "370",
      },
      { text: 'Comment', value: 'comment', sortable: false, align: 'left' },
      { text: 'Delete', value: 'delete', sortable: false, align: 'right' },
    ],

    editedIndex: -1,
    editedItem: {
      name: '',
      comment: '',
    },
    defaultItem: {
      name: '',
      comment: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New behavior' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.rizeReactions = AppVue.rizeReactions
    },

    // Load block module (if any) in the interface
    onLoadNewBlock: function (name) {
      AppVue.onLoadNewBlock(name)
    },

    // Load block module (if any) in the interface
    onLoadBlock: function (project_name, name) {
      AppVue.onLoadBlock(project_name, name)
    },

    onXML2WorkspaceType: function (path, init_path) {

      fetch(init_path)
        .then(response => response.text())
        .then(data => {
          xml = Blockly.Xml.textToDom(data);
          WORKSPACE.clear();
          Blockly.Xml.domToWorkspace(xml, WORKSPACE);
          WORKSPACE.clearUndo();
          WORKSPACE.undo(false);
          WORKSPACE.undo(true);
        })
    },

    editItem(item) {
      this.editedIndex = this.rizeReactions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editComment(item) {
      this.editedIndex = this.rizeReactions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog_comment = true
    },

    onDeleteAlarm(item)
    {
      confirm('Are you sure you want to delete this item?') && this.onDelete(item)
    },

    onDelete(item) {
      console.log(item)
      const index = this.rizeReactions.indexOf(item)
      console.log(this.rizeReactions[index])
      console.log(index)
      this.onDeleteFilesModule(item.name,"reaction")
      this.rizeReactions.splice(index, 1)
      //console.log()
      //this.onDeleteFilesModule()
      //confirm('Are you sure you want to delete this item?') && this.rizeReactions.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.dialog_comment = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveComment()
    {
      if (this.editedIndex > -1) {
        Object.assign(this.rizeReactions[this.editedIndex], this.editedItem)
      } 
      this.close()
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rizeReactions[this.editedIndex], this.editedItem)
      } else {
        this.rizeReactions.push(this.editedItem)
      }
      this.close()
      console.log(this.editedItem.name)
      block_name = this.editedItem.name
      current_type = "reaction"
      this.onLoadNewBlock(this.editedItem.name)
      AppVue.main_dialog = false;
      AppVue.rizeReactions = this.rizeReactions
    },



    onOpenFull(name) {

      module_name = name // Used in blockly important
      console.log("REACTION NAME")
      console.log(module_name)
      this.onLoadBlock(AppVue.project_name, name)
      AppVue.main_dialog = false;

    },

  },
  template: `
  <v-data-table :headers="headers" :items="rizeReactions" sort-by="name" class="elevation-1">
  <template v-slot:top>
    <v-toolbar flat color="white">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New behavior</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules" v-model="editedItem.name" counter="25" clearable label="Name">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                    label="Comment"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_comment" max-width="500px">
    
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                  label="Comment"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveComment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
  </template>
  
  <template v-slot:item.name="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="indigo"  v-on="on" @click="onOpenFull(item.name)">
      <v-icon dark>mdi-circle-edit-outline</v-icon>
      </v-btn>
        </template>
        <span>Edit behavior</span>
    </v-tooltip>

    <v-tooltip bottom>
    <template v-slot:activator="{ on }">
    <v-btn text class="mx-1" fab dark small color="indigo"  @click="editComment(item)"  v-on="on">
    <v-icon dark>mdi-comment-text-outline</v-icon>
    </v-btn>
      </template>
      <span>Edit comment</span>
    </v-tooltip>

        <v-chip  class="ma-2" color="primary" label >
        <v-icon left>mdi-label</v-icon>
        {{ item.name }}
      </v-chip>

  </template>

  <template v-slot:item.delete="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="pink darken-3"  v-on="on" @click="onDeleteAlarm(item)">
      <v-icon dark>mdi-delete-forever</v-icon>
      </v-btn>
        </template>
        <span>Delete behavior</span>
    </v-tooltip>

    

  </template>

  </v-data-table>


`
})


Vue.component('rize-table-goal', {
  props: ['title'],
  data: () => ({

    rizeGoals:[],
    dialog: false,
    dialog_comment:false,
    rules: [v => v.length <= 20 || 'Max 20 characters'],
    rules_comment: [v => v.length <= 100 || 'Max 100 characters'],
    headers: [
      {
        text: 'Robot Behavior',
        align: 'left',
        sortable: true,
        value: 'name',
        width: "370",
      },
      { text: 'Comment', value: 'comment', sortable: false, align: 'left' },
      { text: 'Delete', value: 'delete', sortable: false, align: 'right' },
    ],

    editedIndex: -1,
    editedItem: {
      name: '',
      comment: '',
    },
    defaultItem: {
      name: '',
      comment: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New behavior' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {

      this.rizeGoals = AppVue.rizeGoals 
    },


    // Load block module (if any) in the interface
    onLoadNewBlock: function (name) {
      AppVue.onLoadNewBlock(name)
    },

    // Load block module (if any) in the interface
    onLoadBlock: function (project_name, name) {
      AppVue.onLoadBlock(project_name, name)
    },

    editItem(item) {
      this.editedIndex = this.rizeGoals.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editComment(item) {
      this.editedIndex = this.rizeReactions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog_comment = true
    },

    onDeleteAlarm(item)
    {
      confirm('Are you sure you want to delete this item?') && this.onDelete(item)
    },

    onDelete(item) {
      console.log(item)
      const index = this.rizeGoals.indexOf(item)
      console.log(this.rizeGoals[index])
      console.log(index)
      this.onDeleteFilesModule(item.name,"goal")
      this.rizeGoals.splice(index, 1)

      //confirm('Are you sure you want to delete this item?') && this.rizeGoals.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.dialog_comment = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveComment()
    {
      if (this.editedIndex > -1) {
        Object.assign(this.rizeGoals[this.editedIndex], this.editedItem)
      }
      this.close()
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rizeGoals[this.editedIndex], this.editedItem)
      } else {
        this.rizeGoals.push(this.editedItem)
      }
      this.close()
      console.log(this.editedItem.name)
      current_type = "goal"
      block_name = this.editedItem.name
      this.onLoadNewBlock(this.editedItem.name)
      AppVue.main_dialog = false;
      AppVue.rizeGoals = this.rizeGoals
    },



    onOpenFull(name) {

      module_name = name // Used in blockly imortant
      console.log("GOAL NAME")
      console.log(module_name)
      this.onLoadBlock(AppVue.project.name, name)
      AppVue.main_dialog = false;

    },


  },
  template: `
  <v-data-table :headers="headers" :items="rizeGoals" sort-by="name" class="elevation-1">
  <template v-slot:top>
    <v-toolbar flat color="white">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New behavior</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules" v-model="editedItem.name" counter="25" clearable label="Name">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                    label="Comment"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_comment" max-width="500px">

        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                    label="Comment"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </template>
  
  <template v-slot:item.name="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="indigo"  v-on="on" @click="onOpenFull(item.name)">
      <v-icon dark>mdi-circle-edit-outline</v-icon>
      </v-btn>
        </template>
        <span>Edit behavior</span>
    </v-tooltip>

    <v-tooltip bottom>
    <template v-slot:activator="{ on }">
    <v-btn text class="mx-1" fab dark small color="indigo"  @click="editComment(item)"   v-on="on">
    <v-icon dark>mdi-comment-text-outline</v-icon>
    </v-btn>
      </template>
      <span>Edit comment</span>
    </v-tooltip>

        <v-chip  class="ma-2" color="primary" label >
        <v-icon left>mdi-label</v-icon>
        {{ item.name }}
      </v-chip>

  </template>

  <template v-slot:item.delete="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="pink darken-3"  v-on="on" @click="onDeleteAlarm(item)">
      <v-icon dark>mdi-delete-forever</v-icon>
      </v-btn>
        </template>
        <span>Delete behavior</span>
    </v-tooltip>

    

  </template>

  </v-data-table>


`
})



Vue.component('rize-table-module', {
  props: ['title'],
  data: () => ({


    dialog: false,
    dialog_comment:false,
    rules: [v => v.length <= 20 || 'Max 20 characters'],
    rules_comment: [v => v.length <= 100 || 'Max 100 characters'],
    headers: [
      {
        text: 'Robot Behavior',
        align: 'left',
        sortable: true,
        value: 'name',
        width: "370",
      },
      { text: 'Comment', value: 'comment', sortable: false, align: 'left' },
      { text: 'Delete', value: 'delete', sortable: false, align: 'right' },
    ],

    editedIndex: -1,
    editedItem: {
      name: '',
      comment: '',
    },
    defaultItem: {
      name: '',
      comment: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New behavior' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {

      this.rizeModules = AppVue.rizeModules 
    },


    // Load block module (if any) in the interface
    onLoadNewBlock: function (name) {
      AppVue.onLoadNewBlock(name)
    },

    // Load block module (if any) in the interface
    onLoadBlock: function (project_name, name) {
      AppVue.onLoadBlock(project_name, name)
    },

    onXML2WorkspaceType: function (path, init_path) {

      fetch(init_path)
        .then(response => response.text())
        .then(data => {
          xml = Blockly.Xml.textToDom(data);
          WORKSPACE.clear();
          Blockly.Xml.domToWorkspace(xml, WORKSPACE);
          WORKSPACE.clearUndo();
          WORKSPACE.undo(false);
          WORKSPACE.undo(true);
        })
    },

    editItem(item) {
      this.editedIndex = this.rizeModules.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editComment(item) {
      this.editedIndex = this.rizeReactions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog_comment = true
    },

    onDeleteAlarm(item)
    {
      confirm('Are you sure you want to delete this item?') && this.onDelete(item)
    },


    onDelete(item) {
      console.log(item)
      
      const index = this.rizeModules.indexOf(item)
      console.log(this.rizeModules[index])
      console.log(index)
      this.onDeleteFilesModule(item.name,"modules")
      this.rizeModules.splice(index, 1)
      //console.log()
      //this.onDeleteFilesModule()
      //confirm('Are you sure you want to delete this item?') && this.rizeReactions.splice(index, 1)

    
      
    },


    close() {
      this.dialog = false
      this.dialog_comment = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveComment()
    {
      if (this.editedIndex > -1) {
        Object.assign(this.rizeModules[this.editedIndex], this.editedItem)
      } 
      this.close()
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rizeModules[this.editedIndex], this.editedItem)
      } else {
        this.rizeModules.push(this.editedItem)
      }
      this.close()
      console.log(this.editedItem.name)
      current_type = "module"
      block_name = this.editedItem.name
      this.onLoadNewBlock(this.editedItem.name)
      AppVue.main_dialog = false;
      AppVue.rizeModules = this.rizeModules
    },

    onOpenFull(name) {

      module_name = name // Used in blockly important
      console.log("MODULE NAME")
      console.log(module_name)
      this.onLoadBlock(AppVue.project_name, name)
      AppVue.main_dialog = false;

    },

  },
  template: `
  <v-data-table :headers="headers" :items="rizeModules" sort-by="name" class="elevation-1">
  <template v-slot:top>
    <v-toolbar flat color="white">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New behavior</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules" v-model="editedItem.name" counter="25" clearable label="Name">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                    label="Comment"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_comment" max-width="500px">

      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                  label="Comment"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveComment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
  </template>
  
  <template v-slot:item.name="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="indigo"  v-on="on" @click="onOpenFull(item.name)">
      <v-icon dark>mdi-circle-edit-outline</v-icon>
      </v-btn>
        </template>
        <span>Edit behavior</span>
    </v-tooltip>

    <v-tooltip bottom>
    <template v-slot:activator="{ on }">
    <v-btn text class="mx-1" fab dark small color="indigo"  @click="editComment(item)"  v-on="on">
    <v-icon dark>mdi-comment-text-outline</v-icon>
    </v-btn>
      </template>
      <span>Edit comment</span>
    </v-tooltip>

        <v-chip  class="ma-2" color="primary" label >
        <v-icon left>mdi-label</v-icon>
        {{ item.name }}
      </v-chip>

  </template>

  <template v-slot:item.delete="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="pink darken-3"  v-on="on" @click="onDeleteAlarm(item)">
      <v-icon dark>mdi-delete-forever</v-icon>
      </v-btn>
        </template>
        <span>Delete behavior</span>
    </v-tooltip>

    

  </template>

  </v-data-table>

`
})



Vue.component('rize-table-pattern', {
  props: ['title'],
  data: () => ({


    dialog: false,
    dialog_comment:false,
    rules: [v => v.length <= 20 || 'Max 20 characters'],
    rules_comment: [v => v.length <= 100 || 'Max 100 characters'],
    headers: [
      {
        text: 'Robot Behavior',
        align: 'left',
        sortable: true,
        value: 'name',
        width: "370",
      },
      { text: 'Comment', value: 'comment', sortable: false, align: 'left' },
      { text: 'Delete', value: 'delete', sortable: false, align: 'right' },
    ],

    editedIndex: -1,
    editedItem: {
      name: '',
      comment: '',
    },
    defaultItem: {
      name: '',
      comment: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New behavior' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
       this.rizePatterns = AppVue.rizePatterns
    },


    // Load block module (if any) in the interface
    onLoadNewBlock: function (name) {
      AppVue.onLoadNewBlock(name)
    },

    onLoadBlock: function (project_name, name) {
      AppVue.onLoadBlock(project_name, name)
    },


    onXML2WorkspaceType: function (path, init_path) {

      fetch(init_path)
        .then(response => response.text())
        .then(data => {
          xml = Blockly.Xml.textToDom(data);
          WORKSPACE.clear();
          Blockly.Xml.domToWorkspace(xml, WORKSPACE);
          WORKSPACE.clearUndo();
          WORKSPACE.undo(false);
          WORKSPACE.undo(true);
        })
    },

    editItem(item) {
      this.editedIndex = this.rizePatterns.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editComment(item) {
      this.editedIndex = this.rizePatterns.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog_comment = true
    },


    onDeleteAlarm(item)
    {
      confirm('Are you sure you want to delete this item?') && this.onDelete(item)
    },

    onDelete(item) {
      console.log(item)
    
      const index = this.rizePatterns.indexOf(item)
      console.log(this.rizePatterns[index])
      console.log(index)
      this.onDeleteFilesModule(item.name,"patterns")
      this.rizePatterns.splice(index, 1)
      //console.log()
      //this.onDeleteFilesModule()s
      //confirm('Are you sure you want to delete this item?') && this.rizePatterns.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.dialog_comment = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveComment()
    {
      if (this.editedIndex > -1) {
        Object.assign(this.rizePatterns[this.editedIndex], this.editedItem)
      } 
      this.close()
    },
    
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rizePatterns[this.editedIndex], this.editedItem)
      } else {
        this.rizePatterns.push(this.editedItem)
      }
      this.close()
      console.log(this.editedItem.name)
      current_type = "pattern"
      block_name = this.editedItem.name
      this.onLoadNewBlock(this.editedItem.name)
      AppVue.main_dialog = false;
      AppVue.rizePatterns = this.rizePatterns
    },

    onOpenFull(name) {

      module_name = name // Used in blockly important
      console.log("PATTERN NAME")
      console.log(module_name)
      this.onLoadBlock(AppVue.project_name, name)
      AppVue.main_dialog = false;

    },

  },
  template: `
  <v-data-table :headers="headers" :items="rizePatterns" sort-by="name" class="elevation-1">
  <template v-slot:top>
    <v-toolbar flat color="white">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New behavior</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules" v-model="editedItem.name" counter="25" clearable label="Name">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                    label="Comment"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_comment" max-width="500px">
 
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field :rules="rules_comment" v-model="editedItem.comment" counter="100" clearable
                  label="Comment"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveComment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
  </template>
  
  <template v-slot:item.name="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="indigo"  v-on="on" @click="onOpenFull(item.name)">
      <v-icon dark>mdi-circle-edit-outline</v-icon>
      </v-btn>
        </template>
        <span>Edit behavior</span>
    </v-tooltip>

    <v-tooltip bottom>
    <template v-slot:activator="{ on }">
    <v-btn text class="mx-1" fab dark small color="indigo"  @click="editComment(item)"  v-on="on" >
    <v-icon dark>mdi-comment-text-outline</v-icon>
    </v-btn>
      </template>
      <span>Edit comment</span>
    </v-tooltip>

        <v-chip  class="ma-2" color="primary" label >
        <v-icon left>mdi-label</v-icon>
        {{ item.name }}
      </v-chip>

  </template>
  
  <template v-slot:item.delete="{ item }">
  <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn text class="mx-1" fab dark small color="pink darken-3"  v-on="on" @click="onDeleteAlarm(item)">
      <v-icon dark>mdi-delete-forever</v-icon>
      </v-btn>
        </template>
        <span>Delete behavior</span>
    </v-tooltip>

    

  </template>

  </v-data-table>


`
})



