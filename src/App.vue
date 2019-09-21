<template>
  <div id="app" class="hello"><h1>Awsome Day Belgrade 2019</h1>
      <h4>Enter your nickname: <input v-model="nickname" placeholder="enter your nickname" ><b-button size="lg" variant="primary" @click="setnickname(nickname)">Button</b-button></h4>
      <h4>Hi {{ nickname }} {{ uuid }}</h4>
      <b-row align-h="center" class="mt-5">
      <b-card-group deck>
        <b-card bg-variant="success" text-variant="white" header="Vote Yes" class="text-center" footer-tag="footer">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
          <b-button size="lg" variant="primary"  @click="vote('yes')">Button</b-button>
          <em slot="footer">{{ votesYes }} voted</em>
        </b-card><b-card bg-variant="danger" text-variant="white" header="Vote No" class="text-center" footer-tag="footer">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
          <b-button size="lg" variant="primary" @click="vote('no')">Button</b-button>
          <em slot="footer">{{ votesNo }} voted</em>
        </b-card>
      </b-card-group>
    </b-row>
    <b-row align-h="center" class="mt-5">
      <p>Questions? Ask James <a href="https://twitter.com/jbesw">@jbesw</a>.</p>
    </b-row>
  </div>  
</template>

<script>
const uuidv4 = require('uuid/v4');
import { API } from 'aws-amplify'
export default {
  name: 'app',
  data() {
    return {
      apiName: 'pollCounterAPI',
      apiPeopleName: 'peopleAPI',
      votesYes: 0,
      votesNo: 0,
      nickname: this.$cookie.get('nickname'),
      uuid: this.$cookie.get('uuid-3')
    }
  },
  methods: {
    setnickname: async function(nick) {

      if (this.uuid == undefined) {

        const newUuid = uuidv4()
        const init = {
          body: {
            "nickname" : nick,
            "uuid" : newUuid,
            "points" : 0
          }
        }
        const response = await API.put(this.apiPeopleName, '/people', init)

        this.$cookie.set('nickname',nick)
        this.nickname = nick
        this.$cookie.set('uuid-3',newUuid)
        this.uuid = newUuid

      } else {

        var update = {
          body : {
            TableName: "peopleDDB",
            Key:{
                "uuid": this.uuid
            },
            UpdateExpression: "set nickname = :nickname",
            ExpressionAttributeValues:{
                ":nickname": this.nick
            },
            ReturnValues:"UPDATED_NEW"
          }
        };

        const response = await API.post(this.apiPeopleName, '/people', params)

        this.$cookie.set('nickname',nick)
        this.nickname = nick

      }    

      console.log(nick)
      console.log(this.$cookie.get('uuid'))
    },
    vote: async function (vote) {
      const init = {
        queryStringParameters: {
          vote
        }
      }
      const response = await API.post(this.apiName, '/votes', init)
      if (vote === 'yes') this.votesYes = response.data.Attributes.votesYes
      if (vote === 'no') this.votesNo = response.data.Attributes.votesNo
    },
    updateVotes: async function () {
      const response = await API.get(this.apiName, '/votes/poll-001')
      this.votesNo = response[0].votesNo
      this.votesYes = response[0].votesYes    
    }
  },
  created () {
    this.updateVotes()
    setInterval(this.updateVotes, 3000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
